import React from 'react';
import moment from '../../common/moment';
import { ListGroup, ListGroupItem as BaseListGroupItem} from 'reactstrap';
import HelIcon from '../Common/HelIcon';

import styled from 'styled-components';


const Date = styled.span`
  font-weight: 700;
  font-size: 75%;
`

const ListGroupItem = styled(BaseListGroupItem)`

  &.state--cancelled .task-header {
    text-decoration: line-through;
  }
`

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [] 
    };
    this.parseTimestamp = this.parseTimestamp.bind(this);
  }

  parseTimestamp = (timestamp) => {
    const timeFormat = 'DD.MM.YYYY';
    return moment(timestamp).format(timeFormat);
  }

  render() {
    const sortedTasks = this.props.data.sort((a,b) => {
      let bdate, adate;
      a.attributes.completed_at ? adate=a.attributes.completed_at : adate=a.attributes.due_at;
      b.attributes.completed_at ? bdate=b.attributes.completed_at : bdate=b.attributes.due_at;
      return moment(adate).diff(moment(bdate));
    });
    
    const doneTasks = sortedTasks.map((item,index) => (
            item.attributes.completed_at !== null &&
            <ListGroupItem key={item.id} className={`state--${item.attributes.state}`}>
              <div className="task-header">
                <HelIcon iconName="check" className="text-black-50 mr-3"/>
                <Date>{this.parseTimestamp(item.attributes.completed_at)}</Date>
                {' '}|{' '}
                <span dangerouslySetInnerHTML={{__html: item.attributes.name}}/>
              </div>
              <div><small><span dangerouslySetInnerHTML={{__html: item.attributes.comment}}/></small></div>
            </ListGroupItem>
          ));
    
    const undoneTasks = sortedTasks.map((item,index) => (
            item.attributes.completed_at === null &&
            <ListGroupItem key={item.id} className={`state--${item.attributes.state}`}>
              <div className="task-header">
                <HelIcon iconName="calendar" className="text-black-50 mr-3" />
                <Date>{this.parseTimestamp(item.attributes.due_at)}</Date>
                {' '}|{' '}
                <span dangerouslySetInnerHTML={{__html: item.attributes.name}}/>
              </div>
              <div><small><span dangerouslySetInnerHTML={{__html: item.attributes.comment}}/></small></div>
            </ListGroupItem>
          ));
    
    return (
        <div>
        { doneTasks.length > 0 ?
          <ListGroup className="mb-4">
            <h5>Mitä on tehty?</h5>
            {doneTasks}
          </ListGroup>
          :
          <h5>Ei tehtyjä tehtäviä</h5>
        }
        { undoneTasks.length > 0 ?
          <ListGroup className="mb-4">
            <h5>Mitä on tehtävä?</h5>
            {undoneTasks}
          </ListGroup>
          :
          <h5>Ei tekemättömiä tehtäviä</h5>
        }
        </div>
      
    );
  }
}


export default TaskList
