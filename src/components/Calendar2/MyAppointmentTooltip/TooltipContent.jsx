import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Divider from '@material-ui/core/Divider'
import TimeIcon from '@material-ui/icons/Schedule';

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/da'
dayjs.locale('da')

export default class TooltipContent extends Component {
    constructor(props)
    {
        super(props)
    }

    componentDidMount()
    {

    }

    render() {
        const {
            appointmentData,
            formatDate
        } = this.props

        return (
            <Container
                id="tooltip-content"
                fluid
            >
                <Row className="py-4">
                    <Col className="flex justify-center items-center flex-col" xs={4}>
                        <span style={{backgroundColor: appointmentData.color, borderRadius: '50%'}} className="w-6 h-6"></span>
                        <p className="text-sm mt-1">{appointmentData.calendarName}</p>
                        <Divider className="w-full my-2" />
                        <p className="text-xs text-muted">{ appointmentData.bookedOnline ? 'Online booking' : 'Standard booking' }</p>
                    </Col>
                    <Col>
                        <p className="text-xl">{appointmentData.title}</p>
                        <p className="text-sm">{dayjs(appointmentData.startDate).format('D. MMMM - YYYY')}</p>
                        <Divider className="w-full my-2" />
                        <div className="flex justify-center items-center float-left text-sm">
                            <TimeIcon />
                            <p className="ml-1">
                                {dayjs(appointmentData.startDate).format('H:mm')} - {dayjs(appointmentData.endDate).format('H:mm')}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}
