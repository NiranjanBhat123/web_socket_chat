import React from 'react';
import '../styles/UserList.css';

function UserList({ users, selectUser, selectedUser, unreadCounts }) {
  return (
    <div className="user-list">
      <h2>Online Users</h2>
      <ul>
        {users.map((name) => (
          <li
            key={name}
            onClick={() => selectUser(name)}
            className={name === selectedUser ? 'selected' : ''}
          >
            {name}
            {unreadCounts[name] > 0 && (
              <span className="unread-count">{unreadCounts[name]}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;