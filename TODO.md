# Development Roadmap

1. User Management:
   - [ ] Create a list view of all users (admin/users page)
   - [ ] Implement user detail view
   - [ ] Add ability to verify/unverify users

2. Answer Validation:
   - [ ] Create a view to list pending validations
   - [ ] Implement approve/reject functionality for answers

3. Raffle Management:
   - [ ] Create a view to manage raffle entries
   - [ ] Implement raffle drawing functionality

4. User Profile:
   - [ ] Create user profile page
   - [ ] Implement profile editing functionality
   - [ ] Add game history view for users

5. Game Improvements:
   - [ ] Implement hourly game scheduling
     - Add start and end date/time in admin add and edit modals
   - [ ] Show current game (current hour) on /games page
   - [ ] Fix instant win probability
     - Should be based on probability and available prizes
   - [ ] Implement functional lucky dip
     - Allow picking from a list of unique answers (valid_answers not yet guessed)
   - [ ] Display remaining instant wins for each game
   - [ ] Show instant wins on the game page to entice people
   - [ ] Add instant win prize to user's account after win
   - [ ] Adjust % to scratch off to win scratch card

6. User Credits:
   - [ ] Create a modal to add credits
   - [ ] Implement dummy checkout screen for payment

7. Game Flow:
   - [ ] Redirect users when visiting an ended game page
