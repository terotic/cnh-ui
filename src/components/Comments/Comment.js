import React from 'react';
import { Button } from 'reactstrap';

class Comment extends React.Component {
  
  render() {
    return (
      <div className="hearing-comment">
        <div className="hearing-comment-header clearfix">
          <div className="hearing-comment-votes">
            <Button className="btn-sm hearing-comment-vote-link">
              <span name="thumbs-o-up"/> 4
            </Button>
          </div>
          <div className="hearing-comment-publisher">
            <span className="hearing-comment-user">
              Anonymous
            </span>
            <span className="hearing-comment-date">
              29.11.2018
            </span>
          </div>
        </div>
        <div className="hearing-comment-body">
          <p>{this.props.content}</p>
        </div>
      </div>
    );
  }
}

export default Comment;