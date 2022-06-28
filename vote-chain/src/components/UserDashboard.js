import React from 'react';
import UserNavbar from './UserNavbar';
 
function UserDashboard(){
    return(
        <>
        	<body>
        	<UserNavbar />
        	<div class="container-fluid container-fullw bg-white">
				<div class="row">
					<div class="col-sm-4">
						<div class="panel panel-white no-radius text-center">
							<div class="panel-body">
								<span class="fa-stack fa-2x"> <i class="fa fa-square fa-stack-2x text-primary"></i> <i class="fa fa-smile-o fa-stack-1x fa-inverse"></i> </span>
								<h2 class="StepTitle">My Profile</h2>
								<p class="links cl-effect-1">
									<a href="edit-profile.php">
										Update Profile
									</a>
								</p>
							</div>
						</div>
					</div>
					<div class="col-sm-4">
						<div class="panel panel-white no-radius text-center">
							<div class="panel-body">
								<span class="fa-stack fa-2x"> <i class="fa fa-square fa-stack-2x text-primary"></i> <i class="fa fa-paperclip fa-stack-1x fa-inverse"></i> </span>
								<h2 class="StepTitle">My Appointments</h2>
								<p class="cl-effect-1">
									<a href="appointment-history.php">
										View Appointment History
									</a>
								</p>
							</div>
						</div>
					</div>
					<div class="col-sm-4">
						<div class="panel panel-white no-radius text-center">
							<div class="panel-body">
								<span class="fa-stack fa-2x"> <i class="fa fa-square fa-stack-2x text-primary"></i> <i class="fa fa-paperclip fa-stack-1x fa-inverse"></i> </span>
								<h2 class="StepTitle">Appointment Reminder</h2>
								<p class="cl-effect-1">
									<a href="doctorappointment-reminder.php">
										View Reminder
									</a>
								</p>
							</div>
						</div>
					</div>
                </div>
            </div>
        	</body>
		</>

    )
}
 export default UserDashboard;