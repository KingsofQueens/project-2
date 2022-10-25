# Event focus site

## Pages

Nav
- Log In
- Sign Up
- Log Out - Allows user to log out if they have autheticated
- Profile
- Create a event
- Created Event List
- (Optional) Event going to attend
- (Optional) Folling

Home

- (Core) Search bar for the event 
- (Optional) List of events that near user
- (Core) Sidebar to fillter the events
- (Double Check if possible) Once filter click, the event section appear will filtered (Category/Date/Location)

Single Event Page

- (Core) List the single event details
- (Core) User can comment (add photos) for the event (edit / delete)
- (Core) Only the event owner can edit / delete the event
- (Optional - Attendence) In single event page (list out the participant and can further click on the participant profile)

User Profile 

- (Core) User profile edit/delete function
- (Core) Add/Edit/Delete events
- (Optional - Follow) Followed organiser
- (Optional - Attendence) Attend and not attend the event
- (Optional - Attendence) List past & upcoming events participate (comment / add photos on the event)

Log In 

- (Core) Allows user to log in.

Sign Up

- (Core) Allows new user to sign up.

## RouteHandler
- User Create => GET - '/user/create' => Render a form for user to create an account. 
- User Create => POST - '/user/create' => Handles user creation form submission

- User profile => GET - 'user/profile' => Render 1/ user information, 2/ Allow user to edit or delete profile, 3/ a form for event creation, 4/ populate all the event created by this user
- User profile => POST - 'user/profile' => Handles edit/delete of user profile
- User profile => POST - 'user/profile' => Handles event creation form submission

- Home => GET - '/home' => Render 1/ list of highlight events (details), 2/ Once filter click, the event section appear will filtered (Category/Date/Location), 3/ participant and follower/likes (optional - attendence & follow models)

- Singe Event Page => GET - '/:eventid' => Render 1/ user (link to the host profile), 2/ event details, 3/ user comment (edit & delete) 4/ host edit/delete event 5/ show the partipant number/profile pic/name (Optional - Attendence)
- Singe Event Page => POST - '/:eventid' => Handles edit/delete of event
- Singe Event Page => POST - '/:eventid' => Handles edit/delete of comment

## Models

= Queenie (Core) User - As event host (add, edit and delete functions). And also as participants (attend, comment and follow user)
= Natalia (Core) Event - Host(UserId), Date, location, title, details(message), partipants, price (optional), category
= Joao (Core) Comments -
    message: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 300
    },{
    user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
    },
    picture: {
    type: String
    }
    },
    {
    timestamps: true
    }
= Joao (Good to have) Follow -
    {
    follower: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
    },
    followee: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
    }
    }
(Good to have) Attendence -
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
