import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)
dayjs.extend(utc);

const API_URI =
    process.env.NODE_ENV === 'development'
        ? 'http://api.a.localhost:4000'
        : 'https://api.booktid.net';

function numberToMonth(month) {
    switch (month) {
        case 0:
            return 'January';
        case 1:
            return 'February';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        case 11:
            return 'December';
        default:
    }
}

function dayToNumber(day) {
    switch (day.toLowerCase()) {
        case 'sunday':
            return 0;
        case 'monday':
            return 1;
        case 'tuesday':
            return 2;
        case 'wednesday':
            return 3;
        case 'thursday':
            return 4;
        case 'friday':
            return 5;
        case 'saturday':
            return 6;
        default:
    }
}

function numberToDay(day) {
    switch (day) {
        case 0:
            return 'Søndag';
        case 1:
            return 'Mandag';
        case 2:
            return 'Tirsdag';
        case 3:
            return 'Onsdag';
        case 4:
            return 'Torsdag';
        case 5:
            return 'Fredag';
        case 6:
            return 'Lørdag';
        default:
    }
}

function numbersToInputTime(hour, minute) {
    return `${hour > 9 ? hour : '0' + hour}:${
        minute > 9 ? minute : '0' + minute
    }`;
}

function inputTimeToObj(time) {
    const array = time.split(':').map((e) => Number(e));
    return {
        hour: array[0],
        minute: array[1],
    };
}



function getSettingLabelFromKey(key) {
    switch (key) {
        case 'personalDataPolicy':
            return {
                title: 'Persondatapolitik & samtykkeerklæring',
                subtitle: `
                    Din persondatapolitik og samtykkeerklæring som kunden skal godkende inden booking.

                    Beskriver kunderne rettigheder mht. de data du gemmer om kunden.
                `,
            };
        case 'latestBookingBefore':
            return {
                title: 'Senest booking før',
                subtitle: 'Minimum tid før ankomst en kunde kan booke online.',
            };
        case 'latestCancelbefore':
            return {
                title: 'Senest tid for afbestilling af booking',
                subtitle:
                    'Minimum tid en kunde skal kunne afbestille, før den bookede tid. Ellers skal der ringes for at afbestille.',
            };
        case 'maxDaysBookAhead':
            return {
                title: 'Max dage frem i tid der kan bookes',
                subtitle:
                    'Max antal dage frem i tiden, en kunde har lov til at lave en booking.',
            };
        case 'requireCustomerAddress':
            return {
                title: 'Kunde skal indtaste sin adresse ved online booking',
                subtitle:
                    'Adressen bruges f.eks hvis servicen leveres hjemme hos kunden.',
            };
        case 'hideCustomerCommentSection':
            return {
                title: 'Skjul kommentar felt ved online booking',
                subtitle: 'Kan bruges til at videre give en information.',
            };
        case 'hideServiceDuration':
            return {
                title: 'Skjul service varighed for kunden',
                subtitle:
                    'Gør at kunden ikke kan se hvor lang tid en service tager at udføre.',
            };
        case 'hideServicePrice':
            return {
                title: 'Skjul service pris for kunden',
                subtitle:
                    'Gør at kunden ikke kan se hvor meget en service koster.',
            };
        case 'hideContactInfo':
            return {
                title: 'Skjul kontakt information ved onlinebooking',
                subtitle:
                    'Gør at kunden ikke kan se dine kontakt informationer. Dette skjuler navn, firmaaddresse, email og telefonnummer',
            };
        case '':
            return {
                title: '',
                subtitle: ''
            }
        case 'domainPrefix':
            return {
                title: 'Booking link',
                subtitle: 'Link hvor dine kunder kan booke tid.',
            };
    }
}
const geometry = {
    pythagoras: {
        solveForSideC: (a, b) => {
            const cSquared = Math.pow(a, 2) + Math.pow(b, 2);
            return Math.pow(cSquared, 0.5);
        },
        solveForAngleA: (opposite, hypotenuse) => {
            return Math.asin(opposite / hypotenuse);
        },
    },
    degreesToRadians: (degrees) => degrees * (Math.PI / 180),
    radiansToDegrees: (radians) => radians * (180 / Math.PI),
};

let getWeeklyScheduleByDate = (schedule, date) => {
    let thisWeeksSchedule = false;
    let thisWeek = dayjs.utc(date).week();
    let thisYear = dayjs.utc(date).year();
    switch (schedule.scheduleType) {
        case 'weekly':
            thisWeeksSchedule = schedule.weeklySchedule;
            break;
        case 'biWeekly':
            if (thisWeek % 2 === 0)
                thisWeeksSchedule = schedule.biWeeklySchedule.evenWeek;
            else thisWeeksSchedule = schedule.biWeeklySchedule.unevenWeek;
            break;
        default:
    }
    schedule.specialWeek.forEach((week) => {
        if (week.week === thisWeek && week.year === thisYear) {
            thisWeeksSchedule = week.schedule;
        }
    });
    return thisWeeksSchedule;
};

let getCalendarOpeningHoursByDate = (schedule, date) => {
    let openingHours;
    let thisWeeksSchedule = getWeeklyScheduleByDate(schedule, date);
    let dayOfWeek = dayjs.utc(date).day();
    thisWeeksSchedule.forEach((day) => {
        if (day.day === dayOfWeek) openingHours = day.schedule;
    });

    return openingHours;
};

let getWeeklyOpeningHoursByDate = (calendars, date) => {
    const schedulesClosingSort = calendars
        .map((calendar) => getWeeklyScheduleByDate(calendar.schedule, date))
        .map((schedule) => {
            const newSchedule = schedule.map((dailySchedule) => {
                return {
                    day: dailySchedule.day,
                    opening:
                        dailySchedule.schedule.startOfWork.hour +
                        dailySchedule.schedule.startOfWork.minute / 60,
                    closing:
                        dailySchedule.schedule.endOfWork.hour +
                        dailySchedule.schedule.endOfWork.minute / 60,
                };
            });
            newSchedule.sort((a, b) => b.closing - a.closing);
            return newSchedule[0];
        });
    const closing = Math.ceil(
        schedulesClosingSort.sort((a, b) => b.closing - a.closing)[0].closing
    );

    const schedulesOpeningSort = calendars
        .map((calendar) => getWeeklyScheduleByDate(calendar.schedule, date))
        .map((schedule) => {
            const newSchedule = schedule.map((dailySchedule) => {
                return {
                    day: dailySchedule.day,
                    opening:
                        dailySchedule.schedule.startOfWork.hour +
                        dailySchedule.schedule.startOfWork.minute / 60,
                    closing:
                        dailySchedule.schedule.endOfWork.hour +
                        dailySchedule.schedule.endOfWork.minute / 60,
                };
            });
            newSchedule.sort((a, b) => a.opening - b.opening);
            return newSchedule[0];
        });

    const opening = Math.floor(
        schedulesOpeningSort.sort((a, b) => a.opening - b.opening)[0].opening
    );

    return {
        closing: closing,
        opening: opening,
    };
};

let getDailyOpeningHoursByDate = (calendars, date) => {
    let day = dayjs(date).day();
    const daySort = calendars
        .map((calendar) => getWeeklyScheduleByDate(calendar.schedule, date))
        .map((schedules) => {
            console.log(schedules);
            return schedules
                .filter((schedule) => schedule.day === day)
                .map((dailySchedule) => {
                    return {
                        day: dailySchedule.day,
                        opening:
                            dailySchedule.schedule.startOfWork.hour +
                            dailySchedule.schedule.startOfWork.minute / 60,
                        closing:
                            dailySchedule.schedule.endOfWork.hour +
                            dailySchedule.schedule.endOfWork.minute / 60,
                    };
                })[0];
        });

    const closing = Math.ceil(
        daySort.sort((a, b) => b.closing - a.closing)[0].closing
    );

    const opening = Math.floor(
        daySort.sort((a, b) => a.opening - b.opening)[0].opening
    );

    return {
        closing: closing,
        opening: opening,
    };
};

function createBookingDomain(companyName) {
    return (
        companyName
            .split(' ')
            .join('')
            .toLowerCase()
            .replace(/ø/g, 'oe')
            .replace(/æ/g, 'ae')
            .replace(/å/g, 'aa')
            .replace(/[.]/g, 'dot')
            .replace(/[/]/g, 'slash')
            .replace(/#/g, 'pound')
            .replace(/[?]/g, 'question')
            .replace(/[=]/g, 'equals') + '.booktid.net'
    );
}

export {
    API_URI,
    numberToDay,
    numberToMonth,
    dayToNumber,
    numbersToInputTime,
    inputTimeToObj,
    getSettingLabelFromKey,
    geometry,
    getWeeklyOpeningHoursByDate,
    getDailyOpeningHoursByDate,
    createBookingDomain,
};
