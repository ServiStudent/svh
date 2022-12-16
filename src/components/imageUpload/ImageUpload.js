import React, { useState } from "react";
import { storage, db, fb } from "../../firebase/FirebaseInit";
import "./ImageUpload.css";
import TextLoop from "react-text-loop";

function ImageUpload({ user }) {
    const [image, setImage] = useState(null);
    const [mission, setMission] = useState("");
    const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
    const [spinterval, setSpinterval] = useState(200);
    const [spinButton, setSpinButton] = useState("Stop");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
      if (image === null){

      } else {
          const uploadTask = storage.ref(`images/${image.name}`).put(image);
          uploadTask.on(
              "state_changed",
              (snapshot) => {
                  // progress function
                  const progress = Math.round(
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  );
                  setProgress(progress);
              },
              (err) => {
                  // Error function
                  console.log(err);
                  alert(err.message);
              },
              () => {
                  // Complete function
                  storage
                      .ref("images")
                      .child(image.name)
                      .getDownloadURL()
                      .then((url) => {
                          // Post image inside db
                          db.collection("posts").add({
                              timestamp: fb.firestore.FieldValue.serverTimestamp(),
                              caption: caption,
                              imageUrl: url,
                              username: user.displayName,
                              mission: mission,
                          });

                          setProgress(0);
                          setCaption("");
                          setImage(null);
                      });
              }
          );
          handleShow();
      }
  };

    function stopSpinner() {
        if(spinButton === "Stop"){
            setSpinterval(0);
            setSpinButton("Start again");
            setTimeout(() => {setMission(document.getElementById('textA').textContent)}, 500);
        } else {
            setSpinterval(200);
            setSpinButton("Stop");
        }
    }

    function handleShow() {
        if(show === false){
            setShow(true);
        } else {
            setShow(false);
        }
    }

    return (

       <>
           {show ?  <div className="imageUpload">
                   <h5 className={"exitbutton"} onClick={handleShow}>{"<- Back"}</h5>
               <h1>Your photo mission today: </h1> {" "}
               <br/>
               <TextLoop interval={spinterval}>
                   <h1 id={"textA"}>Make a photo with all the pens on your desk.</h1>
                   <h1 id={"textA"}>Make a photo with your to-do list.</h1>
                   <h1 id={"textA"}>Make a photo of your trash bin.</h1>
                   <h1 id={"textA"}>Make a photo of the view from your window.</h1>
                   <h1 id={"textA"}>Take a photo of your calendar.</h1>
                   <h1 id={"textA"}>Take a photo of your coffee/tea mug.</h1>
                   <h1 id={"textA"}>Take a photo of the slippers/shoes you are currently wearing.</h1>
               </TextLoop>
               <br/>
               <button className="primary__button uploadBtn" onClick={stopSpinner}>{spinButton}</button>
               <input
                   type="text"
                   placeholder="Enter a caption..."
                   onChange={(e) => setCaption(e.target.value)}
                   value={caption}
               />
               <progress className="progress" value={progress} max="100" />
               <div className="uploadCapBtn">
                   <input className="uploadCap" type="file" onChange={handleChange} />
                   {image === null ? <button disabled className="primary__button2 uploadBtn" onClick={handleUpload}>
                           Post
                       </button>:
                   <button className="primary__button uploadBtn" onClick={handleUpload}>
                       Post
                   </button> }
               </div>
           </div> :
               <button className="primary__button uploadBtn" onClick={handleShow}>Upload Photo</button>
           }
       </>
  );
}

export default ImageUpload;
