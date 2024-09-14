# Development Roadmap

1. Admin Panel Setup:
   - [x] Create an admin dashboard page
   - [ ] Implement admin authentication/authorization

2. Game Management:
   - [x] Create a form to add new games
   - [x] Implement a list view of all games
   - [x] Add edit functionality for games
   - [ ] Add delete functionality for games

3. User Management:
   - [ ] Create a list view of all users
   - [ ] Implement user detail view
   - [ ] Add ability to verify/unverify users

4. Dummy Data Generation:
   - [ ] Write a script to generate dummy users
   - [ ] Create a script to generate dummy games
   - [ ] Implement a script to generate dummy answers and game history

5. Game Settings:
   - [ ] Create a form to add/edit game settings
   - [ ] Implement a view to display current game settings

6. Transaction Management:
   - [ ] Create a view to list all transactions
   - [ ] Implement transaction detail view
   - [ ] Add ability to approve/reject pending transactions

7. Answer Validation:
   - [ ] Create a view to list pending validations
   - [ ] Implement approve/reject functionality for answers

8. Instant Win Prize Management:
   - [x] Create a form to add instant win prizes
   - [x] Implement a view to list and edit instant win prizes
   - [x] Add functionality to delete instant win prizes

9. Raffle Management:
   - [ ] Create a view to manage raffle entries
   - [ ] Implement raffle drawing functionality

10. Admin Action Logging:
    - [ ] Implement logging for all admin actions
    - [ ] Create a view to display admin action logs

11. Dashboard Analytics:
    - [ ] Create a dashboard with key metrics (users, games, revenue)
    - [ ] Implement charts for visualizing game data

12. Game Frontend:
    - [ ] Create the main game page
    - [ ] Implement answer submission functionality
    - [ ] Add lucky dip feature

13. User Profile:
    - [ ] Create user profile page
    - [ ] Implement profile editing functionality
    - [ ] Add game history view for users

14. Wallet and Transactions:
    - [ ] Create wallet view for users
    - [ ] Implement deposit and withdrawal functionality
    - [ ] Add transaction history for users

15. Leaderboard:
    - [ ] Create a leaderboard page
    - [ ] Implement sorting and filtering options

16. Notifications:
    - [ ] Set up a notification system
    - [ ] Implement email notifications for important events

17. Testing:
    - [ ] Write unit tests for critical functions
    - [ ] Implement integration tests for key flows

18. Deployment:
    - [ ] Set up staging environment
    - [ ] Configure production environment
    - [ ] Implement CI/CD pipeline




    play a game every hour

play games per hour
 - start and end date/time in admin add and edit modals

/games 
	show current game (current hour)

check instant wins - seem to always be given out should be based on probability and what is left

lucky dip - not functional - should allow to pick from a list of unique answers
unique answers are answers from the valid_answers list that have not been guessed 







need to see how many instant wins for each game is left
should show instant wins on the game page to entice people


add instant win prize to users account after win

adjust % to scratch off to win scratch card




need a modal to add credits, choose amount, dummy checkout screen for payment

