import { shallowMount } from '@vue/test-utils'
import BDatepickerTableRow from '@components/datepicker/DatepickerTableRow'

const newDate = (y, m, d) => {
    const date = new Date(Date.UTC(y, m, d))
    date.getDate = jest.fn(() => date.getUTCDate())
    return date
}
const propsData = {
    firstDayOfWeek: 0,
    week: [
        newDate(2017, 12, 31),
        newDate(2018, 1, 1),
        newDate(2018, 1, 2),
        newDate(2018, 1, 3),
        newDate(2018, 1, 4),
        newDate(2018, 1, 5),
        newDate(2018, 1, 6)
    ],
    month: 12,
    dateCreator: function () {
        return new Date()
    }
}

let wrapper

describe('BDatepickerTableRow', () => {
    beforeEach(() => {
        wrapper = shallowMount(BDatepickerTableRow, { propsData })
    })

    it('is called', () => {
        expect(wrapper.name()).toBe('BDatepickerTableRow')
        expect(wrapper.isVueInstance()).toBeTruthy()
    })

    it('render correctly', () => {
        expect(wrapper.html()).toMatchSnapshot()
    })

    describe('classObject', function () {
        beforeEach(() => {
            wrapper.setProps({
                selectedDate: [propsData.week[1], propsData.week[5]]
            })
        })

        it('should have is-selected class for all range of dates selected', function () {
            expect(wrapper.findAll('.is-selected').length).toBe(5)
        })

        it('should have is-first-selected class for the first date selected within the range', function () {
            const {wrappers: [firstSelectedCell]} = wrapper.findAll('.is-selected')
            expect(firstSelectedCell.classes()).toContain('is-first-selected')
        })

        it('should have is-within-selected class for the dates selected within the range', function () {
            const withinSelectedRangeCells = wrapper.findAll('.is-selected.is-within-selected')
            expect(withinSelectedRangeCells.length).toBe(3)
        })

        it('should have is-last-selected class for the last date selected within the range', function () {
            // wrappers should return 5 elements. Destructure to get the last one
            const {wrappers: [, , , , lastSelectedCell]} = wrapper.findAll('.is-selected')
            expect(lastSelectedCell.classes()).toContain('is-last-selected')
        })

        it('should has is-selected class for all range of dates selected', function () {
            expect(wrapper.findAll('.is-selected').length).toBe(5)
        })

        describe('hovered', function () {
            beforeEach(() => {
                wrapper.setProps({
                    hoveredDateRange: [propsData.week[1], propsData.week[5]]
                })
            })

            it('should have is-within-hovered-range class for all range of dates hovered', function () {
                expect(wrapper.findAll('.is-selected').length).toBe(5)
            })

            it('should have is-first-hovered class for the first date hovered within the range', function () {
                const {wrappers: [firstHoveredCell]} = wrapper.findAll('.is-within-hovered-range')
                expect(firstHoveredCell.classes()).toContain('is-first-hovered')
            })

            it('should have is-within-hovered class for the dates hovered within the range', function () {
                const withinHoveredRangeCells = wrapper.findAll('.is-within-hovered-range.is-within-hovered')
                expect(withinHoveredRangeCells.length).toBe(3)
            })

            it('should have is-last-hovered class for the last date hovered within the range', function () {
                // wrappers should return 5 elements. Destructure to get the last one
                const {wrappers: [, , , , lastHoveredCell]} = wrapper.findAll('.is-within-hovered-range')
                expect(lastHoveredCell.classes()).toContain('is-last-hovered')
            })

            it('should has is-within-hovered-range class for all range of dates hovered', function () {
                expect(wrapper.findAll('.is-within-hovered-range').length).toBe(5)
            })
        })
    })

    it('manage accordingly leap years', () => {
        expect(wrapper.vm.isLeapYear(2020)).toBeTruthy()
        expect(wrapper.vm.daysInYear(2020)).toBe(366)
        expect(wrapper.vm.isLeapYear(2021)).toBeFalsy()
        expect(wrapper.vm.daysInYear(2021)).toBe(365)
    })

    it('manage inner date functions accordingly', () => {
        const thisMonth = new Date().getMonth()
        const day = newDate(2019, thisMonth, 28)

        expect(wrapper.vm.firstWeekOffset(
            2019,
            wrapper.vm.firstDayOfWeek,
            wrapper.vm.rulesForFirstWeek
        )).toBe(-2)

        expect(wrapper.vm.getSetDayOfYear(day)).toBe(240)

        expect(wrapper.vm.weeksInYear(
            2019,
            wrapper.vm.firstDayOfWeek,
            wrapper.vm.rulesForFirstWeek
        )).toBe(52)

        expect(wrapper.vm.getWeekNumber(day)).toBe(35)
        expect(wrapper.vm.getWeekNumber(newDate(2019, 11, 31))).toBe(1)
    })

    it('emit chosen date', () => {
        wrapper.vm.selectableDate = jest.fn(() => true)
        wrapper.vm.emitChosenDate(5)
        expect(wrapper.vm.selectableDate).toHaveBeenCalled()
        expect(wrapper.emitted()['select']).toBeTruthy()
    })

    it('match event days accordingly', () => {
        const thisMonth = new Date().getMonth()
        const day = newDate(2019, thisMonth, 6)
        const todayEvent = {
            date: day,
            type: 'is-warning'
        }
        const events = [
            {
                date: newDate(2019, thisMonth, 2),
                type: 'is-warning'
            },
            todayEvent
        ]
        wrapper.setProps({ events })
        expect(wrapper.vm.eventsDateMatch(day)).toEqual([todayEvent])
    })

    it('emit rangeHoverEndDate', () => {
        wrapper.setProps({ range: true })
        const thisMonth = new Date().getMonth()
        const day = newDate(2019, thisMonth, 6)
        wrapper.vm.setRangeHoverEndDate(day)
        expect(wrapper.emitted()['rangeHoverEndDate']).toBeTruthy()
    })
})
