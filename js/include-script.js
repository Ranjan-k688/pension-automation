// // Create and set the head content
// const head = document.head;
// const title = document.createElement("title");
// title.textContent = "Dynamic Head Title";
// head.appendChild(title);

// // Create and set the header content
// const header = document.querySelector("header");
// const headerContent = document.createElement("h1");
// headerContent.textContent = "Dynamic Header Content";
// header.appendChild(headerContent);

// // Create and set the footer content
// const footer = document.querySelector("footer");
// const footerContent = document.createElement("p");
// footerContent.textContent = "Dynamic Footer Content";
// footer.appendChild(footerContent);







// Define the content for the header and footer
const headerContent = `
  <div class="topheading">
      <div class="logo" data-aos="fade-left" data-aos-duration="1500">
        <img src="images/nrt-logo.svg" alt="NRT" />
      </div> 
      <div><a class="userlogin" href="index.html">Nrt Admin <span><img src="images/users.jpg" alt="student" /></span></a></div>  
    </div>
    <div class="leftmenu"> 
      <div class="sidelink scrollbar-primary" data-aos="fade-right" data-aos-duration="1000">
        <ul class="sidebar-menu">
    <li class="menulink active" ref="admin_Admin">
        <a href="#"> <i class="fa fa-cubes"></i> <span>Admin</span></a>
        <ul class="sub-menu" id="admin_Admin" style="display: block;">
            <li><a class="links" href="#" onclick="getContent('dashboard.html')"><i class="fa fa-desktop"></i> Dashboard </a></li>
            <li><a class="links" href="#" onclick="getContent('company-structure.html')"> <i class="fa fa-building"></i> Company Structure </a> </li>
            <li><a class="links" href="#"> <i class="fa fa-columns"></i> Job Details Setup </a> </li>
            <li><a class="links" href="#"> <i class="fa fa-check-square"></i> Qualifications Setup </a> </li>
            <li><a class="links" href="#"> <i class="fa fa-list-alt"></i> Projects </a> </li>
            <li><a class="links" href="#"> <i class="fa fa-user-circle"></i> Clients </a></li>
            <li><a class="links" href="#"> <i class="fa fa-code"></i> Custom Fields </a></li>
        </ul>
    </li>
    <li class="menulink" ref="admin_Employees">
        <a href="#"> <i class="fa fa-grip-horizontal"></i> <span>Employees</span>  </a>
        <ul class="sub-menu" id="admin_Employees">
            <li>
                <a class="links" href="#"> <i class="fa fa-users"></i> Employees </a>
            </li>
        </ul>
    </li>
    <li class="menulink" ref="admin_Manage">
        <a href="#"> <i class="fa fa-compress"></i> <span>Manage</span>  </a>
        <ul class="sub-menu" id="admin_Manage">
            <li>
                <a class="links" href="#"> <i class="fa fa-file-alt"></i> Documents </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-clock"></i> Attendance </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-plane"></i> Travel </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-align-center"></i> Overtime </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-money-check"></i> Loans </a>
            </li>
        </ul>
    </li>
    <li class="menulink" ref="admin_Admin_Reports">
        <a href="#"> <i class="fa fa-book-reader"></i> <span>Admin Reports</span>  </a>
        <ul class="sub-menu" id="admin_Admin_Reports">
            <li>
                <a class="links" href="#"> <i class="fa fa-window-maximize"></i> Reports </a>
            </li>
        </ul>
    </li>
    <li class="menulink" ref="admin_System">
        <a href="#"> <i class="fa fa-cogs"></i> <span>System</span>  </a>
        <ul class="sub-menu" id="admin_System">
            <li>
                <a class="links" href="#"> <i class="fa fa-cogs"></i> Settings </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-user"></i> Users </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-folder-open"></i> Manage Modules </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-unlock"></i> Manage Permissions </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-microchip"></i> Manage Metadata </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-ruler-horizontal"></i> Field Names </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-wifi"></i> Ice Connect </a>
            </li>
        </ul>
    </li>
    <li class="menulink" ref="admin_Insights">
        <a href="#"> <i class="fa fa-chart-line"></i> <span>Insights</span>  </a>
        <ul class="sub-menu" id="admin_Insights">
            <li>
                <a class="links" href="#"> <i class="fa fa-user-clock"></i> Time and Attendance </a>
            </li>
        </ul>
    </li>
    <li class="menulink" ref="admin_Payroll">
        <a href="#"> <i class="fa fa-file-archive"></i> <span>Payroll</span>  </a>
        <ul class="sub-menu" id="admin_Payroll">
            <li>
                <a class="links" href="#"> <i class="fa fa-money-check-alt"></i> Salary </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-cogs"></i> Payroll Reports </a>
            </li>
        </ul>
    </li>
    <li class="menulink" ref="module_Personal_Information">
        <a href="#"> <i class="fa fa-grip-horizontal"></i> <span>Personal Information</span>  </a>
        <ul class="sub-menu" id="module_Personal_Information">
            <li>
                <a class="links" href="#"> <i class="fa fa-desktop"></i> Dashboard </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-user"></i> Basic Information </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-graduation-cap"></i> Qualifications </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-expand"></i> Dependents </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-phone-square"></i> Emergency Contacts </a>
            </li>
        </ul>
    </li>
    <li class="menulink" ref="module_Time_Management">
        <a href="#"> <i class="fa fa-hourglass-half"></i> <span>Time Management</span>  </a>
        <ul class="sub-menu" id="module_Time_Management">
            <li>
                <a class="links" href="#"> <i class="fa fa-project-diagram"></i> Projects </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-clock"></i> Attendance </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-stopwatch"></i> Time Sheets </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-calendar-plus"></i> Overtime Requests </a>
            </li>
        </ul>
    </li>
    <li class="menulink" ref="module_Documents">
        <a href="#"> <i class="fa fa-file-alt"></i> <span>Documents</span>  </a>
        <ul class="sub-menu" id="module_Documents">
            <li>
                <a class="links" href="#"> <i class="fa fa-file"></i> My Documents </a>
            </li>
        </ul>
    </li>
    <li class="menulink" ref="module_Company">
        <a href="#"> <i class="fa fa-building"></i> <span>Company</span>  </a>
        <ul class="sub-menu" id="module_Company">
            <li>
                <a class="links" href="#"> <i class="fa fa-user"></i> Staff Directory </a>
            </li>
        </ul>
    </li>
    <!-- <li class="menulink" ref="module_Travel_Management">
        <a href="#"> <i class="fa fa-globe"></i> <span>Travel Management</span>  </a>
        <ul class="sub-menu" id="module_Travel_Management">
            <li>
                <a class="links" href="#"> <i class="fa fa-plane"></i> Travel </a>
            </li>
        </ul>
    </li>
    <li class="menulink" ref="module_Finance">
        <a href="#"> <i class="fa fa-calculator"></i> <span>Finance</span>  </a>
        <ul class="sub-menu" id="module_Finance">
            <li>
                <a class="links" href="#"> <i class="fa fa-calculator"></i> Salary </a>
            </li>
            <li>
                <a class="links" href="#"> <i class="fa fa-money-check"></i> Loans </a>
            </li>
        </ul>
    </li> -->
    <li class="menulink" ref="module_User_Reports">
        <a href="#"> <i class="fa fa-book-reader"></i> <span>User Reports</span>  </a>
        <ul class="sub-menu" id="module_User_Reports">
            <li>
                <a class="links" href="#"> <i class="fa fa-window-maximize"></i> Reports </a>
            </li>
        </ul>
    </li>
    <li>
        <div class="user-panel">
            <div class="info"><p></p></div>
        </div>
    </li>
</ul>


        <!-- <ul>
          <li id="dashboard" class="activelink"><a href="dashboard.html"><img src="images/dashboard-icon.png" alt="icon" /> <span>Dashboard</span></a></li>
          <li id="dailywork"><a href="dailywork.html"><img src="images/admitcard-icon.png" alt="icon" /> <span>Daily Work </span></a> </li>  
          <li id="worklist"><a href="worklist.html"><img src="images/examresult-icon.png" alt="icon" /> <span>Work List</span></a> </li> 
          <li id="newrequest"><a href="newrequest.html"><img src="images/examresult-icon.png" alt="icon" /> <span>New Request</span></a> </li> 
          <li id="requestview"><a href="request-view.html"><img src="images/examresult-icon.png" alt="icon" /> <span>Request View</span></a> </li>
          <li><a href="index.html"><img src="images/logout-icon.png" alt="icon" /> <span>Logout</span></a></li>
        </ul> -->
      </div>
    </div>
    <div class="navicon"><span></span></div>
`;

const footerContent = `
    <p>&copy; 2023 My Website</p>
`;

// Function to add header and footer content to the DOM
function addHeaderAndFooter() {
    // Get references to the header and footer elements
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    // Insert the content into the header and footer elements
    header.innerHTML = headerContent;
    footer.innerHTML = footerContent;
}

// Call the function to add the header and footer content when the page loads
window.addEventListener('load', addHeaderAndFooter);
