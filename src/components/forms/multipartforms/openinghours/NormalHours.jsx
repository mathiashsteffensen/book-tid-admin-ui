import React, { useState } from 'react';

import DailyScheduleSettings from './components/DailyScheduleSettings';
import LabelledCheckbox from '../../inputs/LabelledCheckbox';

import { Button, Grid } from '@material-ui/core';
import OpeningHoursModel from './components/OpeningHoursModel';

export default function NormalHours({
    index,
    value,
    schedule,
    name,
    updateSchedule,
}) {
    const [state, setState] = useState({
        onWeekOnly: schedule.scheduleType === 'weekly',
        schedule: schedule,
    });
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const update = () => setShouldUpdate(!shouldUpdate);

    var handleScheduleChange = (id, value) => {
        const selectors = id.split('-');
        let newState = state;
        if (selectors.length === 4) {
            // Handles bi weekly schedule
            newState.schedule[selectors[0]][selectors[1]][
                selectors[2]
            ].schedule[selectors[3]] = value;
            setState(newState);
            update();
        } // Handles weekly schedule, 3 selectors supplied
        else {
            newState.schedule[selectors[0]][selectors[1]].schedule[
                selectors[2]
            ] = value;
            // Ensures the normal weekly schedule will line up with the even week if changed to biweekly
            newState.schedule.biWeeklySchedule.evenWeek[selectors[1]].schedule[
                selectors[2]
            ] = value;
            setState(newState);
            update();
        }
    };

    const setScheduleType = () => {
        let newState = state;
        newState.schedule.scheduleType = !state.onWeekOnly
            ? 'weekly'
            : 'biWeekly';
        newState.onWeekOnly = !state.onWeekOnly;
        setState(newState);
        update();
    };

    return (
        <OpeningHoursModel
            hidden={value !== index}
            title={<h3 className="text-lg">Åbningstider for {name}</h3>}
        >
            <div className="w-full py-2 text-sm">
                {!state.onWeekOnly && (
                    <div className="w-full px-8 text-lg my-2">
                        <h4>Lige uger</h4>
                    </div>
                )}

                <Grid container className=" border-b-2 border-gray-200">
                    <Grid
                        className="flex justify-center items-center"
                        item
                        xs={2}
                    >
                        Dag
                    </Grid>
                    <Grid
                        className="flex justify-center items-center"
                        item
                        xs={1}
                    >
                        Åben
                    </Grid>
                    <Grid
                        className="flex justify-center items-center"
                        item
                        xs={4}
                    >
                        Åbningstider
                    </Grid>
                    <Grid
                        className="flex justify-center items-center"
                        item
                        xs={1}
                    >
                        Pause
                    </Grid>
                    <Grid
                        className="flex justify-center items-center"
                        item
                        xs={4}
                    >
                        Pausetider
                    </Grid>
                </Grid>

                {state.onWeekOnly
                    ? state.schedule.weeklySchedule.map((dailySchedule, i) => {
                          return (
                              <DailyScheduleSettings
                                  scheduleType="weeklySchedule"
                                  handleChange={handleScheduleChange}
                                  key={i}
                                  day={dailySchedule.day}
                                  currentSchedule={dailySchedule.schedule}
                              />
                          );
                      })
                    : state.schedule.biWeeklySchedule.evenWeek.map(
                          (dailySchedule, i) => {
                              return (
                                  <DailyScheduleSettings
                                      scheduleType="biWeeklySchedule"
                                      weekType="evenWeek"
                                      handleChange={handleScheduleChange}
                                      key={i}
                                      day={dailySchedule.day}
                                      currentSchedule={dailySchedule.schedule}
                                  />
                              );
                          }
                      )}

                <div className="w-full">
                    <LabelledCheckbox
                        checked={!state.onWeekOnly}
                        onChange={setScheduleType}
                        label="Vis 2 ugers kalender"
                    />
                </div>
                {!state.onWeekOnly && (
                    <div className="w-full px-8 text-lg my-2">
                        <h4>Ulige uger</h4>
                    </div>
                )}
                {!state.onWeekOnly &&
                    state.schedule.biWeeklySchedule.unevenWeek.map(
                        (dailySchedule, i) => {
                            return (
                                <DailyScheduleSettings
                                    scheduleType="biWeeklySchedule"
                                    weekType="unevenWeek"
                                    handleChange={handleScheduleChange}
                                    key={i + 7}
                                    day={dailySchedule.day}
                                    currentSchedule={dailySchedule.schedule}
                                />
                            );
                        }
                    )}
            </div>

            <div className="w-full">
                <Button
                    className="float-right"
                    variant="contained"
                    color="primary"
                    onClick={() => updateSchedule(state.schedule)}
                >
                    Gem
                </Button>
            </div>
        </OpeningHoursModel>
    );
}
