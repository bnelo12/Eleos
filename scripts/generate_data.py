from random import random
import time

from socketIO_client import SocketIO

socketIO = SocketIO('localhost', 5000)

donations = [
    {"title": "plumbing Services", "location": "Wichita, KS", "service": "other", "description": "Offering pro-bono plumbing work to those with mild pipe damage in the Wichita area", "name": "Jennifer Allard"},
    {"title": "Food Available", "location": "Jackson, MS", "service": "Food and Water", "description": "We have a stockpile of tinned food available including soups, beans and fruit and veggies. I wasn't sure where the best place to donate them would be, but a friend recommended this app.", "name": "Samuel Herberts"},
    {"title": "part time work", "location": "Tuscaloosa, AL", "service": "other", "description": "Vacancy at Sorensen Market on Walnut Street. Must be over 21 to apply", "name": "Andre Sorensen"},
    {"title": "Transport", "location": "Rome, GA", "service": "Travel Assistance", "description": "I am a retired bus driver and empathize greatly with those who are struggling after the tornadoes. If you are struggling to reach grocery stores or need help getting to a job interview etc. I would be happy to help with transport. Unfortunately I don't have my bus anymore so I'm a bit more limited in how many people I can take at one time. But I know the area well and I have time to spare.", "name": "Gerard Hummel"},
    {"title": "Roofing work", "location": "Nassau, NY", "service": "other", "description": "I would like to offer my roofing services with zero labour cost for anyone whose homes have been impacted by the recent hurricane", "name": "Neil Joshi"},
    {"title": "Bottled Water", "location": "Fayetteville, NC", "service": "Food and Water", "description": "I have a large amount of bottled water to donate to those in need", "name": "Laurence Montero"},
]

requests = [
    {"title": "Children's clothes needed", "location": "Oklahoma City, OK", "service": "Everyday Items", "description": "Looking for warm clothes approximately child size 7. Sweatshirts and long trousers would be much appreciated", "name": "Emily Schmitt"},
    {"title": "Housing needed", "location": "Santa Rosa, CA", "service": "Housing", "description": "We are family of 3 with a young child looking to rebuild after our home was destroyed by fire. Looking for a room to rent on a more permanent basis", "name": "Darrel Antunez"},
    {"title": "Food please", "location": "the shelter in South Carolina", "service": "Food and Water", "description": "I am really sick of tinned beans but my mommy says we can't go home or go to taco bell. Please help", "name": "Jonny Eli Low"},
    {"title": "Aid with Documents", "location": "San Bernadino, CA", "service": "other", "description": "We left our home in a rush and did not have time to bring passports or birth certificates. Luckily I have my wallet with a driving license and debit card but replacing these important documents is complicated and difficult. Any legal advice or aid with this would be extremely helpful.", "name": "Renzo Giroux"},
    {"title": "Cooking Utensils", "location": "Anniston, AL", "service": "Everyday Items", "description": "Trying to cook for a large family in a small space after losing mostly everything to hurricanes is difficult but without any utensils it is impossible. I cannot afford to eat out and I am looking to purchase any cooking utensils at a low cost. Pots, pans, ladles, cutlery, colanders. Anything would be helpful!", "name": "Rosa Faust"},
    {"title": "Furniture", "location": "Ventura, CA", "service": "Everyday Items", "description": "Trying to rebuild our lives after losing our home and looking to furnish our new place on a budget. The demand for housing has meant that rent has skyrocketed and we really can't afford much. A bed and bed sheets are top of the list.", "name": "Desmond Bodilsen"},
    {"title": "Car/Transport", "location": "Prescott, AZ", "service": "Travel Assistance", "description": "Luckily my home remained in tact during the fires, but I did lose my car. My friends and family have been very supportive during this time but I can't inconvenience them forever. I am looking for a discounted car and failing that, possibly someone I could carpool with to work until I can find something more permanent as public transport is not helpful.", "name": "Karen Monte"},
]

donation_index = 0
requests_index = 0

while True:
    r = random()
    if r > .5:
        socketIO.emit('request-upload', requests[requests_index])
        requests_index += 1
        if requests_index == len(requests):
            requests_index = 0
    else:
        socketIO.emit('donation-upload', donations[donation_index])
        donation_index += 1
        if donation_index == len(donations):
            donation_index = 0
    time.sleep(random()*4)
    

