import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import "../../src/styles/History.css";
import Header from './Header';
import Cookies from 'js-cookie';
import AlertBox from '../components/AlertBox'

function History(issues) {

  const [tasks, settasks] = useState([]);
  const [toResolvetasks, setToResolvetasks] = useState([]);
  const [hasChanged, setHasChanged] = useState(true);
  const [taskChanged, setTaskChanged] = useState(true);

  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken'); 

    axios.get('https://issue-tracker-system-1t4j.onrender.com/api/v1/protected-route', {
      headers: {
        Authorization: `Bearer ${accessToken}`,  
    }, 
      withCredentials: true })
      .then(response => {
        console.log('User is authenticated:', response.data);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          // Redirect to login page if unauthorized
          const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({ routeName: 'login' }),
              NavigationActions.navigate({ routeName: '' }),
            ]
          });

          this.props.navigation.dispatch(resetAction);
        }
      });
  }, [navigate]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken'); 

    axios.get('https://issue-tracker-system-1t4j.onrender.com/api/v1/users/get-issue-for-user', { 
      headers: {
        Authorization: `Bearer ${accessToken}`,  
    }, 
      withCredentials: true })
      .then((response) => {
        settasks(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [taskChanged]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    axios.get('https://issue-tracker-system-1t4j.onrender.com/api/v1/users/get-issue', { 
      headers: {
        Authorization: `Bearer ${accessToken}`,  
    }, withCredentials: true })
      .then((response) => {
        setToResolvetasks(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [hasChanged]);

  const handleComplete = async (taskId) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      await axios.post('https://issue-tracker-system-1t4j.onrender.com/api/v1/users/complete-report', {
        issueId: taskId
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  
          'Content-Type': 'application/json'
      },
        withCredentials: true });

        setTaskChanged(!taskChanged);
    } catch (error) {
      e => { navigate("/") }
      console.error('Error completing the task:', error);
    }
  };

  // const [acknowledgedTasks, setAcknowledgedTasks] = useState([]);
  const handleAcknowledge = async (taskId) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      await axios.post('https://issue-tracker-system-1t4j.onrender.com/api/v1/users/acknowledge-time', {
        responseId: taskId
      }, {  
        headers: {
        Authorization: `Bearer ${accessToken}`,  
        'Content-Type': 'application/json'
    },withCredentials: true });

      // window.location.reload();
      setHasChanged(!hasChanged);

      AlertBox(1, "Problem acknowledged !!")
      // setAcknowledgedTasks((prev) => [...prev, taskId]);
    } catch (error) {

      // e => { navigate("/") }
      console.error('Error completing the task:', error);
    }
  };

  const navigateToAboutPage = () => {
    window.location.href = '/issue-form';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigateToAboutPage();
  };

  // const handleReport = (e) => {
  //   e.preventDefault();
  //   window.location.href = '/reports';
  // }

  return (
    <>
      <div className="issue-history">

        <Header />
        <main>
          <section className="history-section">
            <h2>History</h2>
            <div className="issues-container">
              <div className="tasks-to-resolve">
                <h3>Issues to Be Resolved</h3>
                <div className="tasks-to-resolve-info">
                  <ol id="list">
                    {toResolvetasks && toResolvetasks.length > 0 && toResolvetasks.map((toResolvetask, index) => (
                      <div key={toResolvetask._id} className="tasks-li">
                        <div className='tasks-h'>
                          <div className='tasks-h3'>
                            <h3>Problem: {toResolvetask.issue} </h3>
                            <p>Description: {toResolvetask.description}</p>
                            <p>Address: {toResolvetask.address}</p>
                          </div>
                          {toResolvetask.acknowledge_at === "" &&
                            <div className='tasks-b'>
                              <button onClick={() => { handleAcknowledge(toResolvetask._id) }}>Acknowledged</button>
                            </div>
                          }
                        </div>
                      </div>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="current-issues">
                <h3>Issues Raised By Me</h3>
                <div className='current-issues-info'>
                  <ol>
                    {tasks && tasks.length > 0 && tasks.map((task, index) => (
                      <div key={task.id} className='tasks-li'>
                        <div className="tasks-h">
                          <div className='tasks-h3'><h3>Task: {task.issue}</h3></div>
                          <div className='tasks-b'><button onClick={() => { handleComplete(task._id) }}>Completed</button></div>
                        </div>
                        <p>Description: {task.description}</p>
                      </div>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer>
          <button className="report-issue-button" onClick={handleSubmit}>Report a Problem</button>
        </footer>
      </div>
    </>
  );
};

export default History;

