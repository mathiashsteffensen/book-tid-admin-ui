import React from 'react';

import { Grid, Checkbox, TextField, Select } from '@material-ui/core';

import {
    numberToDay,
    numbersToInputTime,
    inputTimeToObj,
} from '../../../../../../utils';

import Dash from '@material-ui/icons/Remove';

export default function DailyScheduleSettings({
    day,
    showDate = false,
    currentSchedule,
    handleChange,
    weekType,
    scheduleType,
}) {
    let selectors = weekType
        ? `${scheduleType}-${weekType}-${day}`
        : `${scheduleType}-${day}`;
    return (
        <div className="w-full py-2 border-b-2 border-gray-100">
            <Grid container spacing={2}>
                <Grid className="flex justify-center items-center" item xs={2}>
                    <h4 className="text-xs">
                        {showDate
                            ? `${`${showDate.date()}/${
                                  showDate.month() + 1
                              }`} ` + numberToDay(day)
                            : numberToDay(day)}
                    </h4>
                </Grid>
                <Grid className="flex justify-center items-center" item xs={1}>
                    <Checkbox
                        onChange={() =>
                            handleChange(
                                selectors + '-open',
                                !currentSchedule.open
                            )
                        }
                        checked={currentSchedule.open}
                    />
                </Grid>
                <Grid
                    container
                    className="flex flex-col justify-center md:flex-row md:justify-between items-center"
                    item
                    xs={4}
                >
                    <Grid className="" item xs={5}>
                        <TextField
                            type="time"
                            disabled={!currentSchedule.open}
                            value={numbersToInputTime(
                                currentSchedule.startOfWork.hour,
                                currentSchedule.startOfWork.minute
                            )}
                            onChange={(e) =>
                                handleChange(
                                    selectors + '-startOfWork',
                                    inputTimeToObj(e.target.value)
                                )
                            }
                            inputProps={{
                                step: 300, // 5 min
                                style: { fontSize: '13px' },
                            }}
                        />
                    </Grid>
                    <Grid
                        className="flex justify-center items-center"
                        item
                        xs={1}
                    >
                        <Dash className="w-4" color="disabled" />
                    </Grid>
                    <Grid className="" item xs={5}>
                        <TextField
                            type="time"
                            disabled={!currentSchedule.open}
                            value={numbersToInputTime(
                                currentSchedule.endOfWork.hour,
                                currentSchedule.endOfWork.minute
                            )}
                            onChange={(e) =>
                                handleChange(
                                    selectors + '-endOfWork',
                                    inputTimeToObj(e.target.value)
                                )
                            }
                            inputProps={{
                                step: 300, // 5 min
                                style: { fontSize: '13px' },
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid className="flex justify-center items-center" item xs={1}>
                    <Checkbox
                        onChange={() =>
                            handleChange(
                                selectors + '-break',
                                !currentSchedule.break
                            )
                        }
                        checked={currentSchedule.break}
                    />
                </Grid>
                <Grid
                    container
                    className="flex flex-col justify-center md:flex-row md:justify-between items-center"
                    item
                    xs={4}
                >
                    <Grid item xs={5}>
                        <TextField
                            type="time"
                            disabled={!currentSchedule.break}
                            value={numbersToInputTime(
                                currentSchedule.startOfBreak.hour,
                                currentSchedule.startOfBreak.minute
                            )}
                            onChange={(e) =>
                                handleChange(
                                    selectors + '-startOfBreak',
                                    inputTimeToObj(e.target.value)
                                )
                            }
                            inputProps={{
                                step: 300, // 5 min
                                style: { fontSize: '13px' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Dash className="w-4" color="disabled" />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            type="time"
                            disabled={!currentSchedule.break}
                            value={numbersToInputTime(
                                currentSchedule.endOfBreak.hour,
                                currentSchedule.endOfBreak.minute
                            )}
                            onChange={(e) =>
                                handleChange(
                                    selectors + '-endOfBreak',
                                    inputTimeToObj(e.target.value)
                                )
                            }
                            inputProps={{
                                step: 300, // 5 min
                                style: { fontSize: '13px' },
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
