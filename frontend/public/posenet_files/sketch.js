let video;
let poseNet; 
let pose; 
let yogaNN; 
var iterationCounter;
let state = 'predict'; 
var timeLeft; 
let target; 
let poseCounter; 
let errorCounter; 
let posesArray = ['Mountain', 'Tree', 'Downward Dog', 'Warrior I', 'Warrior II', 'Chair'];
function setup() {
  var canvas = createCanvas(640, 480);
  canvas.position(20, 95)
  video = createCapture(VIDEO);
  video.size(width, height);
   targetLabel = 1; 
  iterationCounter = 0; 
  poseCounter = 0; 
  errorCounter = 0; 
  timeLeft = 10; 
  target = posesArray[poseCounter]; 
   document.getElementById("poseName").textContent = target;
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
  if (results.length > 0)
    {
      pose = results[0].pose; 
    }
   
  });
  // Hide the video element, and just show the canvas
  
  
  let options = {
    inputs: 34,
    outputs: 6,
    task: 'classification',
    debug: true
  }
  
  yogaNN = ml5.neuralNetwork(options);
 const modelInfo = {
    model: 'posenet_models/model.json',
    metadata: 'posenet_models/model_meta.json',
    weights: 'posenet_models/model.weights.bin',
  };
  yogaNN.load(modelInfo, yogiLoaded);

  video.hide();

  
  
}

function yogiLoaded()
{
  console.log("Loaded yoga model"); 
  state = 'predict'; 
  classifyPose(); 
  
}

function classifyPose()
{
  if (pose)
    {
       let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    yogaNN.classify(inputs, gotResult);
    }
  else
    {
      console.log("NO POSE DETECTED"); 
      setTimeout(classifyPose, 100); 
      select("#asana").html(""); 
    }
}

// function gotResult(err, results)
// {
//   if (err) console.log(err); 
//   else
//     {
//       if (results[0].confidence > 0.70)
//         {
//           select("#asana").html(posesArray[results[0].label-1]); 
//         }
//       else
//         {
          
//         }
      
     
//     }
//   classifyPose(); 
  
  
  
// }


function gotResult(error, results) {

  if (results[0].confidence > 0.70) {
    console.log("Confidence");
    if (results[0].label == targetLabel.toString()){
      console.log(targetLabel);
      iterationCounter = iterationCounter + 1;

      console.log(iterationCounter)
      
      if (iterationCounter == 10) {
        console.log("30!")
        iterationCounter = 0;
        nextPose();}
      else{
        console.log("doin this")
        timeLeft = timeLeft - 1;
        if (timeLeft < 10){
          document.getElementById("time").textContent = "00:0" + timeLeft;
        }else{
        document.getElementById("time").textContent = "00:" + timeLeft;}
        setTimeout(classifyPose, 1000);}}
    else{
      errorCounter = errorCounter + 1;
      console.log("error");
      if (errorCounter >= 4){
        console.log("four errors");
        iterationCounter = 0;
        timeLeft = 10;
        if (timeLeft < 10){
          document.getElementById("time").textContent = "00:0" + timeLeft;
        }else{
        document.getElementById("time").textContent = "00:" + timeLeft;}
        errorCounter = 0;
        setTimeout(classifyPose, 100);
      }else{
        setTimeout(classifyPose, 100);
      }}}
  else{
    console.log("whatwe really dont want")
    setTimeout(classifyPose, 100);
}}



function nextPose(){
  if (poseCounter >= 5) {
    console.log("Well done, you have learnt all poses!");
    document.getElementById("time").textContent = "Well done!";
    document.getElementById("time2").textContent = "All poses done.";
    // document.getElementById("sparkles").style.display = 'block';
  }else{
    console.log("Well done, you all poses!");
    //var stars = document.getElementById("starsid");
    //stars.classList.add("stars.animated");
    errorCounter = 0;
    iterationCounter = 0;
    poseCounter = poseCounter + 1;
    targetLabel = poseCounter + 1;
    console.log("next pose target label" + targetLabel)
    target = posesArray[poseCounter];
    document.getElementById("poseName").textContent = target;

  
    timeLeft = 10;
    document.getElementById("time").textContent = "00:" + timeLeft;
    setTimeout(classifyPose, 4000)}
}






function draw()

{
   translate(video.width, 0);
  scale(-1,1);
  image(video, 0, 0, width, height);
  
  if (state == "predict")
    {
       
  if (pose)
  
    {
      
  
      
       for (let j = 0; j < pose.keypoints.length; j++) 
       {
      
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
  
        fill(0, 255, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        
      
       }
     
     
    }
    }
  
 

  
}

function modelReady()
{
  console.log("PoseNet is here"); 
}