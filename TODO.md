# Development Roadmap

1. User Management:
   - [x] Create a list view of all users (admin/users page)
   - [x] Implement user detail view
   - [x] Add ability to verify/unverify users (Consider adding user status management in the future)

2. Answer Validation:
   - [x] Create a view to list pending validations
   - [x] Implement approve/reject functionality for answers
   - [ ] Implement automatic update of game status when a unique answer is approved

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



if a user wins an instant win - it should be added to their account immediately and the prize pool should be deducted from the game.

countdown until next game starts on todays game in @game/page.tsx
stop entries for current game 1 hour before it ends (or have variable time)
modal for adding credits to account



remove scratch card from your answers section
highlight status based on uniqueness - green for being the only player in game with a unique answer and orange for if more than 1 player has a unique answer, red for not unique, this means the prize is split between everyone who has a unique answer

make scratch cards in instant win prizes locked
redesign instant win prizes to be like clover competitions

put answer next to scratch card


update status of other answers when someone else  answers the same as theirs so if it was unique then someone guesses the same we need to update to not unique 

order your answers 

- check credits before purcahse /
    even if we dont have credits we can still play with custom answer, lucky dip disables the button /
- unique answers are case sensative, for example I put lilac and Lilac and they were both unique - this should not be unique /
- cant put same answer twice
    a user can enter the same guess twice - we should do a check to prevent this