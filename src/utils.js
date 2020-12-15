import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const API_URI = process.env.NODE_ENV === 'development' ? "http://api.a.localhost:4000" : "https://api.booktid.net"

function numberToMonth(month)
{
    switch(month)
    {
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

function dayToNumber(day)
{
    switch(day.toLowerCase())
    {
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

function numberToDay(day)
{
    switch(day)
    {
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

function numbersToInputTime(hour, minute)
{
    return `${hour > 9 ? hour : '0' + hour}:${minute > 9 ? minute : '0' + minute}`
}

function inputTimeToObj(time)
{
    const array = time.split(':').map(e => Number(e))
    return {
        hour: array[0],
        minute: array[1]
    }
}

const timePickerOptions = ['00:00','00:05','00:10','00:15','00:20','00:25','00:30','00:35','00:40','00:45','00:50','00:55','01:00','01:05','01:10','01:15','01:20','01:25','01:30','01:35','01:40','01:45','01:50','01:55','02:00','02:05','02:10','02:15','02:20','02:25','02:30','02:35','02:40','02:45','02:50','02:55','03:00','03:05','03:10','03:15','03:20','03:25','03:30','03:35','03:40','03:45','03:50','03:55','04:00','04:05','04:10','04:15','04:20','04:25','04:30','04:35','04:40','04:45','04:50','04:55','05:00','05:05','05:10','05:15','05:20','05:25','05:30','05:35','05:40','05:45','05:50','05:55','06:00','06:05','06:10','06:15','06:20','06:25','06:30','06:35','06:40','06:45','06:50','06:55','07:00','07:05','07:10','07:15','07:20','07:25','07:30','07:35','07:40','07:45','07:50','07:55','08:00','08:05','08:10','08:15','08:20','08:25','08:30','08:35','08:40','08:45','08:50','08:55','09:00','09:05','09:10','09:15','09:20','09:25','09:30','09:35','09:40','09:45','09:50','09:55','10:00','10:05','10:10','10:15','10:20','10:25','10:30','10:35','10:40','10:45','10:50','10:55','11:00','11:05','11:10','11:15','11:20','11:25','11:30','11:35','11:40','11:45','11:50','11:55','12:00','12:05','12:10','12:15','12:20','12:25','12:30','12:35','12:40','12:45','12:50','12:55','13:00','13:05','13:10','13:15','13:20','13:25','13:30','13:35','13:40','13:45','13:50','13:55','14:00','14:05','14:10','14:15','14:20','14:25','14:30','14:35','14:40','14:45','14:50','14:55','15:00','15:05','15:10','15:15','15:20','15:25','15:30','15:35','15:40','15:45','15:50','15:55','16:00','16:05','16:10','16:15','16:20','16:25','16:30','16:35','16:40','16:45','16:50','16:55','17:00','17:05','17:10','17:15','17:20','17:25','17:30','17:35','17:40','17:45','17:50','17:55','18:00','18:05','18:10','18:15','18:20','18:25','18:30','18:35','18:40','18:45','18:50','18:55','19:00','19:05','19:10','19:15','19:20','19:25','19:30','19:35','19:40','19:45','19:50','19:55','20:00','20:05','20:10','20:15','20:20','20:25','20:30','20:35','20:40','20:45','20:50','20:55','21:00','21:05','21:10','21:15','21:20','21:25','21:30','21:35','21:40','21:45','21:50','21:55','22:00','22:05','22:10','22:15','22:20','22:25','22:30','22:35','22:40','22:45','22:50','22:55','23:00','23:05','23:10','23:15','23:20','23:25','23:30','23:35','23:40','23:45','23:50','23:55']

function getSettingLabelFromKey(key)
{
    switch(key)
    {
        case "personalDataPolicy":
            return {
                title: "Persondatapolitik & samtykkeerklæring",
                subtitle: `
                    Din persondatapolitik og samtykkeerklæring som kunden skal godkende inden booking.

                    Beskriver kunderne rettigheder mht. de data du gemmer om kunden.
                `
            }
        case "latestBookingBefore":
            return {
                title: "Senest booking før",
                subtitle: "Minimum tid før ankomst en kunde kan booke online."
            }
        case "latestCancelbefore":
            return {
                title: "Senest tid for afbestilling af booking",
                subtitle: "Minimum tid en kunde skal kunne afbestille, før den bookede tid. Ellers skal der ringes for at afbestille."
            }
        case "maxDaysBookAhead":
            return {
                title: "Max dage frem i tid der kan bookes",
                subtitle: "Max antal dage frem i tiden, en kunde har lov til at lave en booking."
            }
        case "requireCustomerAddress":
            return {
                title: "Kunde skal indtaste sin adresse ved online booking",
                subtitle: "Adressen bruges f.eks hvis servicen leveres hjemme hos kunden."
            }
        case "hideCustomerCommentSection":
            return {
                title: "Skjul kommentar felt ved online booking",
                subtitle: "Kan bruges til at videre give en information."
            }
        case "hideServiceDuration":
            return {
                title: "Skjul service varighed for kunden",
                subtitle: "Gør at kunden ikke kan se hvor lang tid en service tager at udføre."
            }
        case "hideServicePrice":
            return {
                title: "Skjul service pris for kunden",
                subtitle: "Gør at kunden ikke kan se hvor meget en service koster."
            } 
        case "hideContactInfo":
            return {
                title: "Skjul kontakt information ved onlinebooking",
                subtitle: "Gør at kunden ikke kan se dine kontakt informationer."
            } 
        case "domainPrefix":
            return {
                title: "Booking link",
                subtitle: "Link hvor dine kunder kan booke tid."
            }      
    }
}
const geometry = {
    pythagoras: {
        solveForSideC: (a, b) =>
        {
            const cSquared = Math.pow(a, 2) + Math.pow(b, 2)
            return Math.pow(cSquared, 0.5)
        },
        solveForAngleA: (opposite, hypotenuse) =>
        {
            return Math.asin(opposite/hypotenuse)
        }
    },
    degreesToRadians: (degrees) => degrees * (Math.PI / 180),
    radiansToDegrees: (radians) => radians * (180 / Math.PI),
}

let getWeeklyScheduleByDate = (schedule, date) =>
{
    let thisWeeksSchedule = false;
    let thisWeek = dayjs.utc(date).week()
    let thisYear = dayjs.utc(date).year()
    switch(schedule.scheduleType)
    {
        case 'weekly':
            thisWeeksSchedule = schedule.weeklySchedule
            break;
        case 'biWeekly':
            if (thisWeek % 2 === 0) thisWeeksSchedule = schedule.biWeeklySchedule.evenWeek
            else thisWeeksSchedule = schedule.biWeeklySchedule.unevenWeek
            break;
        default:
    }
    schedule.specialWeek.forEach((week) =>
    {
        if (week.week === thisWeek && week.year === thisYear)
        {
            thisWeeksSchedule = week.schedule
        }
    })
    return thisWeeksSchedule
}

let getCalendarOpeningHoursByDate = (schedule, date) =>
{
    let openingHours;
    let thisWeeksSchedule = getWeeklyScheduleByDate(schedule, date)
    let dayOfWeek = dayjs.utc(date).day()
    thisWeeksSchedule.forEach((day) =>
    {
        if (day.day === dayOfWeek) openingHours = day.schedule;
    })

    return openingHours
}

let getWeeklyOpeningHoursByDate = (calendars, date) =>
{
    const schedulesClosingSort = calendars.map((calendar) => getWeeklyScheduleByDate(calendar.schedule, date)).map(schedule => {
        const newSchedule = schedule.map((dailySchedule) =>
        {
            return {
                day: dailySchedule.day,
                opening: dailySchedule.schedule.startOfWork.hour + (dailySchedule.schedule.startOfWork.minute/60),
                closing: dailySchedule.schedule.endOfWork.hour + (dailySchedule.schedule.endOfWork.minute/60)
            }
        })
        newSchedule.sort((a, b) => b.closing-a.closing)
        return newSchedule[0]
    })
    const closing = Math.ceil(schedulesClosingSort.sort((a, b) => b.closing-a.closing)[0].closing)

    const schedulesOpeningSort = calendars.map((calendar) => getWeeklyScheduleByDate(calendar.schedule, date)).map(schedule => {
        const newSchedule = schedule.map((dailySchedule) =>
        {
            return {
                day: dailySchedule.day,
                opening: dailySchedule.schedule.startOfWork.hour + (dailySchedule.schedule.startOfWork.minute/60),
                closing: dailySchedule.schedule.endOfWork.hour + (dailySchedule.schedule.endOfWork.minute/60)
            }
        })
        newSchedule.sort((a, b) => a.opening-b.opening)
        return newSchedule[0]
    })

    const opening = Math.floor(schedulesClosingSort.sort((a, b) => a.opening-b.opening)[0].opening)

    return {
        closing: closing,
        opening: opening
    }
}
export {
    API_URI,
    numberToDay,
    numberToMonth,
    dayToNumber,
    timePickerOptions,
    numbersToInputTime,
    inputTimeToObj,
    getSettingLabelFromKey,
    geometry,
    getWeeklyOpeningHoursByDate
}