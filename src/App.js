import React from "react";
import logo, { ReactComponent } from './logo.svg';
import './App.css';
import firebase from './firebase';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

const db = firebase.firestore();

const curUser = {
  name: "",
  id: "",
  img: null,
  loggedIn: false,
}

var userProf = null

async function loginApp() {
  var provider = new firebase.auth.GoogleAuthProvider();
  userProf = await firebase.auth().signInWithPopup(provider);
  const user = {
    screenName: userProf.user.displayName,
    id: userProf.user.uid,
    image: userProf.user.photoURL,
  }
  curUser.id = user.id;
  curUser.name = user.screenName;
  curUser.img = user.image;
  curUser.loggedIn = true;
  document.getElementById("namespace").innerText = "Hi " + curUser.name;
  console.log(curUser.name);
  console.log(userProf.user);
  document.getElementById("userImg").src = curUser.img;
  db.collection('users').doc(user.id).set(user);

};

async function logOut() {
  userProf = firebase.auth().signOut();
  document.getElementById("namespace").innerText = "succesfully logged out";
  curUser.id = "";
  curUser.name = "";
  curUser.loggedIn = false;
  console.log(userProf.user);
}

function sendMessage(subred, title, mes) {
  var loc = "Subs/" + subred + "/Posts";
  db.collection(loc).doc(title).set({ Message: mes, Upvotes: 0, posted: true, poster: curUser.name });
}

export default function App() {

  return (
    <Router>
      
      <div>
        <h1 id="namespace"></h1>
        <img id="userImg" src="" height="60" width="60"></img>
        <button type="button" id="login" onClick={loginApp}>login</button>
        <button type="button" id="signout" onClick={logOut}>sign out</button>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>

          <li>
            <Link to="/subreddits">subreddits</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/subreddits">
            <Subredditos />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


function readDoc(sub, list) {
  var loc = "Subs/" + sub + "/Posts";
  db.collection(loc).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      // doc.data() is never undefined for query doc snapshots
      var mess = doc.data().Message;
      var li = document.createElement("ul");
      li.id = doc.id;

      var upvote = document.createElement("button");
      var repl = document.createElement("input");
      repl.type = "text";
      var subRepl = document.createElement("button");
      subRepl.textContent = "Submit reply";
      subRepl.addEventListener("click", function () {
        if(curUser.loggedIn == true){
          db.collection(loc).doc(doc.id).collection("Replies").doc(repl.value).set({ Message: repl.value , Poster: curUser.name});
        }
        else{
          alert("please login first");
        }
        

      });

      upvote.addEventListener("click", function () {
        var upvot = doc.data().Upvotes + 1;
        db.collection(loc).doc(doc.id).set({ Message: mess, Upvotes: upvot, posted: true });

      });
      upvote.textContent = "Upvote";

      li.appendChild(document.createTextNode(doc.data().poster + ": " + doc.id + ", " + mess + ": upvotes: " + doc.data().Upvotes));
      document.getElementById(list).appendChild(li);
      document.getElementById(list).appendChild(upvote);
      document.getElementById(list).appendChild(repl);
      document.getElementById(list).appendChild(subRepl);

      db.collection(loc).doc(doc.id).collection("Replies").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc2) {
          // doc.data() is never undefined for query doc snapshots
          var mess2 = doc2.data().Message;
          var li2 = document.createElement("ul");
          li2.id = doc2.id;
          var op = doc.id;
          li2.appendChild(document.createTextNode(doc2.data().Poster + ": " + mess2));
          document.getElementById(op).appendChild(li2);



        });
      });


    });
  });
}


function Subredditos() {
  let match = useRouteMatch();

  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/Tech`}>Tech</Link>
        </li>
        <li>
          <Link to={`${match.url}/Art`}>Art</Link>
        </li>
        <li>
          <Link to={`${match.url}/School`}>School</Link>
        </li>
        <li>
          <Link to={`${match.url}/Gaming`}>Gaming</Link>
        </li>
        <li>
          <Link to={`${match.url}/Music`}>Music</Link>
        </li>
      </ul>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/Tech`}>
          <SubsTech />
        </Route>
        <Route path={`${match.path}/Art`}>
          <SubsArt />
        </Route>
        <Route path={`${match.path}/School`}>
          <SubsSchool />
        </Route>
        <Route path={`${match.path}/Gaming`}>
          <SubsGaming />
        </Route>
        <Route path={`${match.path}/Music`}>
          <SubsMusic />
        </Route>
      </Switch>
    </div>
  );
}

function SubsTech() {
  readDoc("Tech", "listTech");

  return <div>

    <div>
      <ul id="listTech" style={{ color: "red" }, { marginLeft: 40 }} class="circle"> </ul>
    </div>
    <div>
      <h3>Post Title</h3>
      <input type="text" id="titleInput" size="20" name="titleInput"></input>
      <br></br>
      <h3>Post Title</h3>
      <input type="text" id="messageInput" size="20" name="messageInput"></input>
      <br></br>
      <button type="button" id="submitPost" onClick={submitTech}>Submit</button>
    </div>

  </div>
}
function SubsSchool() {
  readDoc("School", "listSchool");

  return <div>

    <div>
      <ul id="listSchool" style={{ color: "red" }, { marginLeft: 40 }}> </ul>
    </div>
    <div>
      <h3>Post Title</h3>
      <input type="text" id="titleInput" size="20" name="titleInput"></input>
      <br></br>
      <h3>Post Title</h3>
      <input type="text" id="messageInput" size="20" name="messageInput"></input>
      <br></br>
      <button type="button" id="submitPost" onClick={submitSchool}>Submit</button>
    </div>

  </div>
}
function SubsGaming() {
  readDoc("gaming", "listGaming");

  return <div>

    <div>
      <ul id="listGaming" style={{ color: "red" }, { marginLeft: 40 }}> </ul>
    </div>
    <div>
      <h3>Post Title</h3>
      <input type="text" id="titleInput" size="20" name="titleInput"></input>
      <br></br>
      <h3>Post Title</h3>
      <input type="text" id="messageInput" size="20" name="messageInput"></input>
      <br></br>
      <button type="button" id="submitPost" onClick={submitGaming}>Submit</button>
    </div>

  </div>
}
function SubsMusic() {
  readDoc("Music", "listMusic");

  return <div>

    <div>
      <ul id="listMusic" style={{ color: "red" }, { marginLeft: 40 }}> </ul>
    </div>
    <div>
      <h3>Post Title</h3>
      <input type="text" id="titleInput" size="20" name="titleInput"></input>
      <br></br>
      <h3>Post Title</h3>
      <input type="text" id="messageInput" size="20" name="messageInput"></input>
      <br></br>
      <button type="button" id="submitPost" onClick={submitMusic}>Submit</button>
    </div>

  </div>
}
function SubsArt() {
  readDoc("Art", "listArt");
  return <div>

    <div>
      <ul id="listArt" style={{ color: "red" }, { marginLeft: 40 }}> </ul>
    </div>
    <div>
      <h3>Post Title</h3>
      <input type="text" id="titleInput" size="20" name="titleInput"></input>
      <br></br>
      <h3>Post Content</h3>
      <input type="text" id="messageInput" size="20" name="messageInput"></input>
      <br></br>
      <button type="button" id="submitPost" onClick={submitArt}>Submit</button>
    </div>

  </div>
}

function submitTech() {
  if (curUser.loggedIn == true) {
    const message = document.getElementById("messageInput").value;
    const postTitle = document.getElementById("titleInput").value;

    sendMessage("Tech", postTitle, message);
  }
  else {
    alert("please log in first")
  }

}
function submitSchool() {
  if (curUser.loggedIn == true) {
    const message = document.getElementById("messageInput").value;
    const postTitle = document.getElementById("titleInput").value;

    sendMessage("School", postTitle, message);
  }
  else {
    alert("please log in first")
  }

}
function submitGaming() {
  if (curUser.loggedIn == true) {
    const message = document.getElementById("messageInput").value;
    const postTitle = document.getElementById("titleInput").value;

    sendMessage("Gaming", postTitle, message);
  }
  else {
    alert("please log in first")
  }

}
function submitMusic() {
  if (curUser.loggedIn == true) {
    const message = document.getElementById("messageInput").value;
    const postTitle = document.getElementById("titleInput").value;

    sendMessage("Music", postTitle, message);
  }
  else {
    alert("please log in first")
  }

}
function submitArt() {
  if (curUser.loggedIn == true) {
    const message = document.getElementById("messageInput").value;
    const postTitle = document.getElementById("titleInput").value;

    sendMessage("Art", postTitle, message);
  }
  else {
    alert("please log in first")
  }

}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>Welcome to the best version of reddit there could be</h2>;
}
