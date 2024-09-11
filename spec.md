# Project Specification for UniqueWin

## 1. Game Overview
- **Concept**: UniqueWin is a skill-based gambling game where players guess answers to questions. The winner is the player with the unique answer.
- **Gameplay**: 
  - Players pay a credit of £1 to guess. 
  - A minimum deposit of £10 is required, which converts to 10 credits (1 credit = £1). 
  - Players can win credits through instant wins, which are used solely to play games.
  - Each player can participate in one game per day, with games running from 8 PM to 8 PM, followed by a live draw at 9 PM.

## 2. Business Model
- **Revenue Streams**:
  - Entry fees from players (£1 per guess).
  - Minimum deposit requirement (£10).
  - Instant win prizes funded by a portion of entry fees.
  - Potential partnerships or sponsorships for marketing.

## 3. User Registration
- **Form Fields**: 
  - Username
  - Password
  - Full Name
  - Date of Birth (DOB) - must validate for over 18
  - Address
  - Postcode
  - Country
  - Phone Number
  - T&Cs/Privacy Policy agreement
  - Opt-in for marketing communications
- **Validation**: Ensure all fields are validated, especially DOB for age verification.

## 4. User Experience (UX)
- **Design Principles**: 
  - Focus on mobile-first design, ensuring accessibility and ease of use.
  - Intuitive navigation with clear calls to action.
  - Real-time updates to enhance engagement and reduce frustration.
- **User Journey**:
  - Users land on the homepage, learn about the game, and can easily navigate to register or play.
  - After registration, users can view available games, submit answers, and check their status.

## 5. Submitting Answers
- **Dynamic Updates**: Answers submitted should update the game history without refreshing the page.
- **Answer Status**:
  - **Unique**: Green textbox, congratulatory message.
  - **Duplicate**: Red textbox, display count of duplicates.
  - **Pending**: Answers not on the prepopulated list are marked as pending until verified.

## 6. Game Mechanics
- **Answer Validation**: 
  - Unique answers are tracked and displayed.
  - If an answer becomes non-unique, it updates accordingly.
- **Game End**: Countdown timer for each game, with history hidden in the last hour.
- **Live Draw**: Winners are announced during a live draw at 9 PM.

## 7. Instant Win Feature
- **Mechanism**: Players can reveal their instant win through a scratch card effect that shows their prize.
- **Creation and Management**: Admins can create and edit instant win prizes, which can then be attached to games during creation or editing.

## 8. Lucky Dip Feature
- **Functionality**: Automatically selects a unique answer from a list. If a user guesses a unique answer, it is removed from the list. If a user picks it with Lucky Dip, it is also removed.

## 9. Game History
- **Display**: Show who guessed, number of guesses, total earnings, and guess times.

## 10. User Account Management
- **Profile Editing**: Users can edit their basic profile information.
- **Self-Exclusion**: Users can lock their accounts for 6 or 12 months, with no ability to reverse this action.

## 11. Admin Control Panel (Admin CP)
- **Overview Screen**: Display current game status, number of answers, current winners, and prize amounts.
- **Game Management**: Ability to add, edit, delete games, and manage game statuses (Live, Pending, Finished).
- **Instant Win Management**: Admins can create, edit, and delete instant win prizes, attaching them to games as needed.
- **Answer Approval**: Admins can approve or disapprove answers, marking them as unique, not unique, or invalid.

## 12. Raffle System
- **Functionality**: The system randomly selects a winner from those who guessed unique answers in a game.

## 13. Notifications
- **Future Work**: Notifications will be addressed in version 2.

## 14. Coupon System
- **Future Work**: No coupon codes are set up yet; this will be considered for future development.

## 15. ID Verification
- **Removed**: ID verification is no longer required.

## 16. Payment Gateway
- **Pending Decision**: The payment gateway is still being decided.

## 17. Application Structure
- **Landing Page**: Entry point for users, providing an overview of the game and features.
- **Home Page**: General information about UniqueWin, user testimonials, and links to other sections.
- **Games List Page**: Displays all available games, allowing users to select a game to view details or participate.
- **Dynamic Game Page**: Detailed view of a specific game, showing the question, current status, and options for users to submit answers.
- **Admin Section**: Provides administrative functionalities for managing games and user statistics.

## 18. Components Overview
- **AddGameModal**: Modal for adding new games, allowing admins to input game details.
- **Header**: Navigation bar with links to different sections of the app.
- **Footer**: Contains copyright information and additional links.
- **GameCard**: Represents an individual game in the games list.
- **GameOverviewCard**: Provides an overview of multiple games.
- **GamePlay**: Handles gameplay mechanics for users.
- **LoginModal**: Manages user authentication.
- **InstantWinPrizeManager**: Manages instant win prizes.
- **WheelOfFortune**: Interactive component simulating a spinning wheel for prizes.
- **WaysToWin**: Displays different ways users can win in the game.
- **QuickStatsBox**: Shows quick statistics about the game and recent player activities.

## 19. Database Schema Overview
- **Tables**:
  - **games**: Stores game details, including question, start/end times, valid answers, and pricing.
  - **answers**: Records user answers, their status, and whether they are part of an instant win or lucky dip.
  - **instant_win_prizes**: Manages instant win prizes, including type, amount, and probability.
  - **raffle_entries**: Tracks entries for the raffle based on unique answers.
  - **profiles**: Contains user profile information, including balance and credit balance.
  - **transactions**: Logs all user transactions related to deposits and gameplay.

## 20. Marketing and User Acquisition
- **Strategies**: 
  - Utilize social media platforms for promotions and user engagement.
  - Consider partnerships with influencers or gaming communities to reach a broader audience.
  - Implement referral programs to encourage existing users to invite friends.

## 21. Future Enhancements
- **Version 2 Features**: 
  - Implement notifications for users regarding game updates and results.
  - Explore the addition of coupon codes for promotional purposes.
  - Consider adding more interactive features to enhance user engagement.

## Conclusion
This comprehensive specification reflects the detailed vision for UniqueWin, focusing on the core functionalities, user experience, and business considerations necessary for development. It serves as a reference for the development team and can be expanded upon as new features are discussed or implemented.