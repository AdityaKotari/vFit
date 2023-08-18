# vFit: Nurturing collaborative fitness online

### 🏆 Won [first place](https://www.linkedin.com/posts/activity-6809089524434644992-W8Ge) in [HackOn with Amazon](https://hackon-with-amazon.hackerearth.com/)

### 👪 Team: [Pranav Balaji](https://github.com/greenfish8090), [Kevin Biju](https://github.com/heavycrystal), [Gaurav Bhattacharjee](https://github.com/guilefoylegaurav), and [Aditya Kotari](https://github.com/AdityaKotari)

## Links:

* **Live Demo at [https://vfit.onrender.com/](https://vfit.onrender.com/) (The UI only works on desktop/laptop right now)**

*  **Final presentation: [https://www.youtube.com/watch?v=1l98Ek4INcQ](https://www.youtube.com/watch?v=1l98Ek4INcQ)**
*  **Demonstration video: [https://www.youtube.com/watch?v=E0EyNNqSheE](https://www.youtube.com/watch?v=E0EyNNqSheE)**

## Screenshots:

![image (3)](https://user-images.githubusercontent.com/39759092/120115569-eb821b80-c1a1-11eb-975b-90a7be53c2e9.png)
![image (1)](https://user-images.githubusercontent.com/39759092/120115574-ed4bdf00-c1a1-11eb-85f8-38b6582690d5.png)

## Fitness Game-ified: Our project pitch

In recent times, a new social paradigm has emerged due to COVID-19. People are unable to exit their homes for long periods of time, and as a result their physical fitness has been going down considerably. 
Additionally, the lack of interaction with friends and family has been taking a mental and social toll on a lot of us as well.

As college students, we know first-hand what the lack of social and physical freedom can do. So we set out to solve this issue in a simple and easy-to-use manner. vFit was the result of our work.

VFit is a socially-oriented fitness app. Users can register on vFit and find other users to exercise with using a simple web inteface. The crux of the app is the dynamic inference of yoga poses. Using a unique combination of machine learning and computer vision, the website is able to identify 6 different poses from just the user's webcam feed. The user can exercise by holding a series of poses for a fixed amount of time [determined by the aforementioned ML model] and can also choose to exercise with a friend. The whole inference is all done in the browser to assuage privacy concerns.

The app was written in EJS and Node.js and was deployed to Heroku. A MySQL instance hosted on AWS was used as the backing data store. The ML inference was done using Tensorflow.js and P5 and we adopted the PoseNet ML model for the same.

The USP of the app is this exercising with friends feature, as users are able to engage in a dynamic exercise with a friend and also interact with someone face to face at the same time.

## How to run this:

Some features just won't work if you don't have access to the secret keys. But if you do have the keys or you want to try it out without them(in which case it'll probably break), do the following:
1. Make sure you've installed Node.js and NPM and can use them from the terminal
2. Navigate to the folder you cloned the project in using the command line
3. Run
```
npm i
``` 
4. Run
```
node index.js
```
The demo link provided above should be the easiest way to test out the features if you don't want to make changes to the source code. 

Feel free to message any of the team members on any social platforms if you have any other queries 
