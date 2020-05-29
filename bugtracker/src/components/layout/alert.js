import React , { Component , Fragment } from 'react'
import {withAlert} from 'react-alert'
import {connect} from 'react-redux'
import propTypes from 'prop-types'

export class Alert extends Component{

    static propTypes = {
        errors : propTypes.array.isRequired,
        messages : propTypes.array.isRequired
    }

    componentDidUpdate(prevProps){
        const { alert , errors , messages} = this.props
        if (errors !== prevProps.errors) {
           if (errors.msg.name) {
               alert.error(`NAME :  ${errors.msg.name.join()}`)
           }
           if (errors.msg.wiki) {
            alert.error(`WIKI :  ${errors.msg.wiki.join()}`)

        }
        if (errors.msg.creator) {
            alert.error(`CREATOR :  ${errors.msg.creator.join()}`)

        }
        }
        if (messages !==prevProps.messages) {
            if(messages.ProjectAdd){
                alert.success(messages.ProjectAdd)
            }
            if(messages.ProjectDelete){
                alert.success(messages.ProjectDelete)
            }
        }
    }


    render(){
        return(
            <Fragment />
        )
    }
}

const mapStateToProps = (state) => ({
    errors : state.errors,
    messages : state.messages
});

export default connect(mapStateToProps)(withAlert()(Alert))