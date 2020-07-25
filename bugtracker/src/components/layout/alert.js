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
            if(messages.BugDelete){
                alert.success(messages.BugDelete)
            }
            if(messages.StatusChange){
                alert.success(messages.StatusChange)
            }
            if(messages.StatusPermission){
                alert.success(messages.StatusPermission)
            }
            if(messages.BUGASSIGNED){
                alert.success(messages.BUGASSIGNED)
            }
            if(messages.EMPTYCOMMENT){
                alert.error(messages.EMPTYCOMMENT)
            }
            if(messages.EMPTYTAG){
                alert.error(messages.EMPTYTAG)
            }
            if(messages.EMPTYUSER){
                alert.error(messages.EMPTYUSER)
            }
            if(messages.EMPTYNAME){
                alert.error(messages.EMPTYNAME)
            }
            if(messages.EMPTYWIKI){
                alert.error(messages.EMPTYWIKI)
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