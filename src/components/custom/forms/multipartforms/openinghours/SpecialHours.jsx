import React from 'react';
import OpeningHoursModel from './components/OpeningHoursModel';

import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);

import { TextField, Button } from '@material-ui/core';
import DailyScheduleSettings from './components/DailyScheduleSettings';

export default function SpecialHours({
    index,
    value,
    name,
    schedule,
    updateSchedule,
}) {
    const [state, setState] = React.useState({
        schedule: schedule,
        selectedWeek: false,
        selectedDate: false,
    });

    const [shouldUpdate, setShouldUpdate] = React.useState(false);
    const update = () => setShouldUpdate(!shouldUpdate);

    const setSelectedWeek = (e) => {
        const date = dayjs(e.target.value);
        const selectedWeek = [];
        for (let i = 0; i < 7; i++) {
            selectedWeek.push(date.day(i));
        }
        let newState = state;
        newState.selectedWeek = selectedWeek;
        newState.selectedDate = date;
        let schedules = newState.schedule.specialWeek.filter(
            (week) => week.week === date.week() && week.year === date.year()
        );
        console.log(schedules)
        if (schedules.length !== 0) {
            newState.schedule.specialWeek = [
                ...newState.schedule.specialWeek.filter(
                    (week) =>
                        week.week !== date.week() &&
                        week.year !== date.year() &&
                        week.year
                ),
                ...[schedules[0]],
            ];
        } else {
            let defaultSchedule;
            if (state.schedule.scheduleType === 'biWeekly') {
                defaultSchedule =
                    state.selectedDate.week() % 2 === 0
                        ? state.schedule.biWeeklySchedule.evenWeek
                        : state.schedule.biWeeklySchedule.unevenWeek;
            } else defaultSchedule = state.schedule.weeklySchedule;
            newState.schedule.specialWeek.push({
                year: date.year(),
                week: date.week(),
                schedule: defaultSchedule,
            });
        }
        setState(state);
        update();
    };

    const handleScheduleChange = (id, value) => {
        const selectors = id.split('-');
        let newState = state;
        newState.schedule.specialWeek = newState.schedule.specialWeek.map(
            (specialWeek) => {
                if (specialWeek.week === state.selectedDate.week())
                    specialWeek.schedule[selectors[1]].schedule[
                        selectors[2]
                    ] = value;
                return specialWeek;
            }
        );
        setState(newState);
        update();
    };

    return (
        <OpeningHoursModel
            hidden={value !== index}
            title={
                <div className="w-full ">
                    <h3 className="text-lg">
                        Specielle åbningstider for {name}
                    </h3>
                    <div className="mt-2 w-full flex justify-between items-center">
                        <TextField
                            id="date"
                            label="Vælg uge"
                            type="date"
                            onChange={setSelectedWeek}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        {state.selectedDate && (
                            <h4>Uge {state.selectedDate.week()}</h4>
                        )}
                    </div>
                </div>
            }
        >
            {state.selectedWeek ? (
                state.selectedWeek.map((day, i) => (
                    <DailyScheduleSettings
                        handleChange={handleScheduleChange}
                        scheduleType="specialWeek"
                        key={i}
                        day={day.day()}
                        showDate={day}
                        currentSchedule={
                            state.schedule.specialWeek.filter(
                                (e) =>
                                    e.week === state.selectedDate.week() &&
                                    e.year === state.selectedDate.year()
                            )[0].schedule[i].schedule
                        }
                    />
                ))
            ) : (
                <div className="mt-4">
                    <h4>Vælg en uge</h4>
                </div>
            )}

            <div className="w-full mt-2">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateSchedule(state.schedule)}
                    className="float-right"
                >
                    Gem
                </Button>
            </div>
        </OpeningHoursModel>
    );
}
