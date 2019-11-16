import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { firestoreConnect} from 'react-redux-firebase';
import { Redirect } from 'react-router-dom'
import { editOrSubmitNewItemHandler } from '../../store/database/asynchHandler'
import moment from 'moment'
const M = window.M;

export class ItemScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listToEdit: props.todoList,
            itemToEdit: props.todoItem
        }

        this.descriptionInput = React.createRef();
        this.assignedToInput = React.createRef();
        this.dueDatePicker = React.createRef();
        this.completedCheckbox = React.createRef();
    }

    componentDidMount(){
        M.updateTextFields();
        if(this.props.todoItem){
            let description = this.descriptionInput.current;
            let assignedTo = this.assignedToInput.current;
            let dueDate = this.dueDatePicker.current;
            let completedCheckbox = this.completedCheckbox.current;

            description.value = this.props.todoItem.description;
            assignedTo.value = this.props.todoItem.assigned_to;
            dueDate.value = this.props.todoItem.due_date;
            completedCheckbox.checked = this.props.todoItem.completed;
        }
    }

    handleSubmitItem = (e) => {
        e.preventDefault();
        

    }

    handleCancelItem = (e) => {
        e.preventDefault();

        this.props.history.goBack();
    }

    render() {
        const { auth, todoItem } = this.props;
        if(!auth.uid){
            return <Redirect to="/login"/>
        }
        if (todoItem) {
            console.log(this.props.todoList)
            console.log(this.props.todoItem)

            return(
                <div className="container white">

                    <div className="row">
                        <form className="col s12">
                            <div className="row">
                                <div className="input-field col s8">
                                    <input ref={this.descriptionInput} id="description" type="text" className="validate"/>
                                    <label htmlFor="description">Description</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s8">
                                    <input ref={this.assignedToInput} id="assigned_to" type="text" className="validate"/>
                                    <label htmlFor="assigned_to">Assigned To</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s8">
                                    <input ref={this.dueDatePicker} id="due_date" type="date" className="datepicker"/>
                                    <label htmlFor="due_date">Due Date</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s8">
                                    <p>
                                        <label>
                                            <input ref={this.completedCheckbox} id="completed" type="checkbox"/>
                                            <span>Completed</span>
                                        </label>
                                    </p>
                                </div>
                            </div>
                            <button class="btn waves-effect waves-light" type="submit" onClick={this.handleSubmitItem}>
                                Submit
                                <i class="material-icons right">send</i>
                            </button>
                            <button class="btn waves-effect waves-light" onClick={this.handleCancelItem}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )
        } else {
            return (
                <span> Loading Item... </span>
            )
        }

        
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id, index } = ownProps.match.params;
    
    const { todoLists } = state.firestore.data;
    const todoList = todoLists ? todoLists[id] : null;
    let itemIndex; 
    let todoItem;
    let newItem = {
        description: '',
        assigned_to: '',
        due_date: moment(new Date().getDate()).calendar(),
        completed: false

    }
    if (todoList) {
      todoList.id = id;
      itemIndex = index ? parseInt(index, 10) : todoList.items.length;
      todoItem = index ? todoList.items[itemIndex] : newItem;    
    }
    
    console.log(todoItem)
    console.log(state);
    console.log(ownProps);

    return {
        todoList,
        todoItem,
        auth: state.firebase.auth
    }

    
}

const mapDispatchToProps = (dispatch)=> ({
    submitItem: (todoList, item) => dispatch(editOrSubmitNewItemHandler(todoList, item))
})

export default compose(
    connect(mapStateToProps,
        mapDispatchToProps),
        firestoreConnect([
            { collection: 'todoLists' }
        ])
)(ItemScreen)
