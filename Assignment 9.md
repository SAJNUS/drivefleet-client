  
Assignment Category: CAT\_05

## **DriveFleet Car Rental Platform**

**🎥🎥 [Explanation Video](https://drive.google.com/file/d/1jlTaKl6XyvnfliW4pkS3MKBebS0Qw7c-/view?usp=sharing)🎥🎥** 

##### **Project Theme**

Build a full-stack Car Rental Platform where users can explore available cars, view car details, rent vehicles, manage their bookings, and maintain profiles. Users can add, update, and delete car listings. The system must include secure authentication, JWT protection, booking management, and responsive modern UI.

**Key Rules:** 

* **GitHub Commits:**   
  * Include a minimum of 15 notable GitHub commits on the client side.  
  * Include a minimum of 8 notable GitHub commits on the server side   
* **Readme.md:** Add a meaningful readme.md file with the name of your website and a live site URL on client side. Include a minimum of five bullet points to feature your website.    
* **Lorem Text:** Don’t use any Lorem ipsum text; you can not use the default alert to show any error or success message.  
* **Host your Application:**  You can choose deployment systems like Vercel, Render for hosting. As you develop a single-page application   
  * Ensure that the page doesn't throw any error on reloading from any routes.    
  * Logged in User must not be redirected to Login on reloading any private route   
* Make the site responsive on mobile, tablet and desktop.  
* Secure MongoDB credentials using environment variables.  
* Design should be clean and recruiter-friendly.  
* Do not copy any assignment/module project.

# **Deployment Guideline**

* Ensure the server does not throw CORS / 404 / 504 issues.  
* The live site should work perfectly.  
* Reloading any route should not throw errors.  
* Logged-in users must not redirect to login on private route reload.

**Main Requirements: **  

1. **Layout Structure**

   ### **Public Layout**

* Navbar with Logo, Home, Explore Cars, Add Car, My Bookings, Login/Register (conditional)  
* User profile dropdown after login  
1. If logged in:  
    Show profile dropdown:  
* Add Car  
* My Bookings  
* My Added Cars  
* Logout  
2. If not logged in:  
    Show Login button.  
* Footer with useful links, contact info, social icons  
  * Contact Information  
  * Social Icons  
  * Useful Links

  ### **Private Layout**

  Private pages:

  1. My Bookings  
  2. My Added Cars  
  3. Add Car

2. **Home**

   #### **Banner Section**

Create banner section with:

* Title  
* Short description  
* Explore Cars button


  #### **Dynamic Section (Required)**

       **Available Cars Section**

Create an Available Car section using database data. 

Show a minimum 6 cards.

Each card must contain:

* Car Details info (Decide on your own which data should be shown)  
* View Details Button

  #### **Extra Static Sections**

* Implement 2 Extra static sections on your own


3. **Authentication**

   ## **User Login**

Create a Login Page where users can log in to their account.

1. ### Login Page Must Include:

* A clear Login Title  
* A form with the following fields:  
  * Email  
  * Password  
* A link to the Register Page  
* Login Button  
* Google Login Button  
  * On successful Google login:  
    * Redirect user to the home route 

  ### Login Functionality:

* If login is successful:  
  * Redirect the user to home route  
* If login fails:  
  * Show an error message using toast / inline message / custom alert


  ## **User Registration**

Create a Register Page where new users can create an account.

1. ### Register Page Must Include:

* A clear Registration Title  
* A form with the following fields:  
  * Name  
  * Email  
  * Photo URL  
  * Password  
* Register Button  
* Google Login Button  
  * On successful Google login:  
    * Redirect user to the home route 

  ### Registration Functionality:

* If registration is successful:  
  * Redirect user to Login page  
* If registration fails:  
  * Show error message using toast / inline message / custom alert

**Implement password validation**  
For password validation, you need to follow the criteria below. Show a password error in the form, and don't Register for an invalid password

- Must have an Uppercase letter in the password   
- Must have a Lowercase letter in the password    
- Length must be at least 6 characters 


 💡Don’t implement email verification or the forget password method, as it will inconvenience the examiner. If you want, you can add these after receiving the assignment result.

4. **CRUD Operations**  
   All data must be stored in MongoDB Database

## **Add Car (Private Route)**

Create a form to add a car listing.

### **Input Fields:**

* Car Name  
* Daily Rent Price  
* Car Type (SUV / Sedan / Hatchback / Luxury / etc.)  
* Image URL (imgbb/postimage)  
* Seat Capacity  
* Pickup Location  
* Description  
* Availability Status

## **Explore Cars Page**

Show all cars in card/grid layout. Show unavailable cars also (If you have any).

Each Card Includes:

* Car Details info (Decide on your own which data should be shown)  
* Details Button

## **Car Details Page**

Show full details:

* Car Details info (Decide on your own which data should be shown)  
* Book Now button [(Check This For Functionality)](#booking-system)  
  * It will open a modal/go to a different page

## 

## **My Added Cars Page**

Show his own cars in card/grid layout. Add Update and Delete button functionality.

* Car Details info (Decide on your own which data should be shown)  
* Update Button [(Check this for functionality)](#update-car)  
* Delete Button [(Check this for functionality)](#delete-car)

## **Update Car** {#update-car}

Owners can edit their own listed cars.

Editable Fields:

* Price  
* Description  
* Availability  
* Image  
* Type  
* Location

## **Delete Car** {#delete-car}

Owners can delete their own listings with confirmation modal.

# **Booking System** {#booking-system}

## **Book Car**

Logged-in users can book a car.

### **Booking Form Fields:**

* Driver Needed (Yes/No)  
* Special Note  
* Book Now Button

## **My Bookings Page**

Show logged-in user's bookings.

Each booking card/table shows:

* Car Name  
* Total Price  
* Booking Date (Explore new Date()) \-\> [Link](https://www.w3schools.com/js/js_dates.asp)  
* Any other info that you may need for UI purpose

5. **Other Requirements**

### **Loading Spinner**

Show loading spinner when data is fetching.

### **Not Found Page**

Create a custom 404 page.

Show:

* Friendly error message  
* Back to Home button

##### 

### **Challenges** 

1. **JWT with Cookies**

Implement:

* Generate token  
* Store in HTTPOnly cookie  
* Verify in middleware  
* Protect private APIs

2. **Search and Filter**  
1. Implement search by Car name. Use $regex/$in operator of MongoDB. Use any of the operator  
* Regex operator ([Link](https://www.geeksforgeeks.org/mongodb/mongodb-regex/))  
* In Operator ([Link](https://www.geeksforgeeks.org/mongodb/mongodb-in-operator/))  
2. Implement filter by car type.

3. Booking Count  
   1. Use $inc  
   2. Increase booking\_count after booking

## **Optional Requirements**

* Theme Toggle  
* Framer Motion

**UI Design Requirements:** 

* **Unique Design:** First, decide what kind of website you want to make. Then, search online or check out websites like ThemeForest to get ideas for the design. But remember, your website idea shouldn't be similar to any projects you've done before or to any examples in our modules or conceptual sessions.  
* You can also look for free resources on [blogs](https://bootcamp.uxdesign.cc/free-images-and-resources-collection-for-website-c77f2fc46ce5) to help with your website. 

1. Keep the main heading style (font, size, color) consistent across all sections.

2. Keep paragraph spacing balanced and text easily readable.  
3. Maintain uniform image sizes and spacing.

     4\.   Use the same button style as on the home page.

5. Ensure good spacing and proper alignment.  
6. Navbar, Keep the heading/logo same style and size as on the home page.  
7. Use a grid layout with equal image sizes.  
8. Keep all cards equal height and width (especially in services, projects, or products section)  
9. Use the new X logo instead of the old Twitter bird to match the latest rebrand  
10. Responsiveness: Make it responsive for all devices, including mobile, tablet, and desktop views. 

Resources: 

* [https://uiverse.io/](https://uiverse.io/)   
* [https://devmeetsdevs.com/](https://devmeetsdevs.com/)   
* [https://bootcamp.uxdesign.cc/free-images-and-resources-collection-for-website-c77f2fc46ce5](https://bootcamp.uxdesign.cc/free-images-and-resources-collection-for-website-c77f2fc46ce5)   
* [https://themeforest.net/?srsltid=AfmBOopTj6PNz51iuV2YJXUtBP8nt19\_zT5LG2dToAjIHQqzNCzregn0](https://themeforest.net/?srsltid=AfmBOopTj6PNz51iuV2YJXUtBP8nt19_zT5LG2dToAjIHQqzNCzregn0)   
* [https://codecanyon.net/?srsltid=AfmBOooRoUfeK7lOROpchCuA4hPVj5P9WRmtDQJ9K0E6Yhf4VTrHhXKt](https://codecanyon.net/?srsltid=AfmBOooRoUfeK7lOROpchCuA4hPVj5P9WRmtDQJ9K0E6Yhf4VTrHhXKt) 

**What to submit:**

* Your client-side code GitHub repository  
* Your server-side code GitHub repository  
* Your live website link