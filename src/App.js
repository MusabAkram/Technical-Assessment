import React, { Component } from 'react';
import './App.css'
class App extends Component {
  constructor(props) {
    super(props);
    //defining state variables
    this.state = {
      posts: [],
      text : [],
      filtered : [],
      str  : " ",
      wordCounts : { },
      sorted : [],
      companies : [],
      companyStr : [],

    };
  }

  componentDidMount() {
    var xhttp = new XMLHttpRequest();
    var self = this;
    //fetching data from the API
    xhttp.onreadystatechange = function(e){
      if (xhttp.readyState === 4 && xhttp.status === 200){
        self.setState({
          posts: JSON.parse(this.response)
        });
      }
    }
    //API reference
    xhttp.open("get", "http://profiler.markinson.com.au/api/Customer", true);
    xhttp.send();
  }
  render() {
    return (
      <div className = "container-fluid">
      <div className="Center App-title Display-2"><h1>TOP 5 MOST REPEATED WORDS</h1></div>
      <div className = "container-fluid Card Center">
      {
        //Making a String Array of the company names
        this.state.posts.map(
          post => {
            this.state.text.push(post.companyName);
            //Converting Array to single String
            this.state.str = this.state.text.join(" ")
          })
        }
          {
            //Splitting compnay names into array of words
            this.state.str.split(" ").map(
            val => {
              //Check if the length of word is > 2 and it is not a common word => store in wordCounts Object
              if(val.length > 2 && val != "and" && val != "The" && val != "is")
                //Counting most repeated words from the String
                this.state.wordCounts[val] = (this.state.wordCounts[val] || 0) + 1;
            })}{
              //pushing the count of words into sorted array
              Object.keys(this.state.wordCounts).map(key => {
                this.state.sorted.push([key, this.state.wordCounts[key]])
              })
            }{
              this.state.sorted = this.state.sorted.sort((current,next) =>{
                //sort of the basis of occurence
                if(current[1] !== next[1])
                  return next[1] - current[1]
                //sort on the basis of alphabetical order if occurence is same
                else if (current[0] < next[0])
                  return -1
                else if (current[0] > next[0])
                  return 1
              })
            }{
              //getting 5 most repeated words
              Object.keys(this.state.sorted).map((key,index) => {
                if(index < 5){
                  //getting list of companies that contain the specified word
                  this.state.posts.map((val,i)=>{
                    if (val['companyName'].includes(this.state.sorted[key][0])) {
                      this.state.companyStr.push(val.companyName)
                    }
                  })
                  //storing name of 5 companies for every word in array
                  this.state.companies[index] = this.state.companyStr.slice(0,5).join(",")
                  //reset companyStr to store next five companies
                  this.state.companyStr = []
                  return  <div><h1 className= "Center">{index+1}. {this.state.sorted[key][0]}</h1>
                  <h3 className= "Center">Count = {this.state.sorted[key][1]}</h3>
                  <h5 className = "Center">{1}. {this.state.companies[index].split(",")[0]}</h5>
                  <h5 className = "Center">{2}. {this.state.companies[index].split(",")[1]}</h5>
                  <h5 className = "Center">{3}. {this.state.companies[index].split(",")[2]}</h5>
                  <h5 className = "Center">{4}. {this.state.companies[index].split(",")[3]}</h5>
                  <h5 className = "Center">{5}. {this.state.companies[index].split(",")[4]}</h5>
                  </div>
                }
              })
            }
            </div>

            </div>
          );
        }
      }

      export default App;
