import React from 'react';
import './user.css';

function User() {
    return(
        <>
            <table class="content-table">
                <thead class='thead'>
                    <tr>
                    <th>Change Phase</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Current Phase : Election Phase</td>
                    </tr>
                    <tr>
                        <td>
                            <button className = 'button1' id = 'button1'>Change Phase</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};
export default User;