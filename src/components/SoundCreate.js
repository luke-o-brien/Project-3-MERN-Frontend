// this code is from Nick's code: image-upload-example

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'bulma'
import Select from 'react-select'
import categoryType from '../data/categoryType.js'
import hashtagfy from 'hashtagfy2'
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'



function SoundCreate() {


  const navigate = useNavigate()

  const [soundDisplay, updateSoundDisplay] = useState([])
  const [button, updateButton] = useState(false)
  // const [inputValue, updateInputValue] = useState('')

  // const hashtag2 = hashtagfy('', { capitalize: false })
  
  const [formData, setFormData] = useState({
    fileName: '',
    caption: '',
    hashtag: [],
    category: '',
    subCategory: '',
    url: '',

  })

  // ! Function to fetch all images in our API
  async function fetchSound() {
    try {
      const { data } = await axios.get('/api/all-sounds')
      // ! reversing the data so that the newest images will appear first
      updateSoundDisplay(data.reverse())
    } catch (err) {
      console.log(err)
    }
  }
  

  useEffect(() => {
    fetchSound()
  }, [])

  // ! Function which updates the formData with the caption the user wants to upload.
  function handleChange(event) {
    // updateInputValue(event.target.value)
    setFormData({ 
      ...formData, 
      [event.target.name]: event.target.value,
    })
  }

  // ! Cloudinary image upload! This is will also update the formData with the url string for the photo
  // ! to be uploaded
  function handleUpload() {
    window.cloudinary.createUploadWidget(
      {
        cloudName: 'tjmcodes', //!this will be your cloud name - this should be in your .env
        uploadPreset: 'ejbxzzti', //!this will be your upload presets - this should be in your .env
        cropping: true
      },
      (err, result) => {
        if (result.event !== 'success') {
          return
        }
        setFormData({
          ...formData,
          url: result.info.secure_url
        })
      }
    ).open()
  }

  // ! Function that submits our formData to our API.
  // ! Will call the fetchImage function & take user back to images
  async function handleSubmit(event) {
    event.preventDefault()
    const token = localStorage.getItem('token')

    // const newFormData = {
    //   ...formData,
    //   fileName: '',
    // caption: '',
    // hashtag: [],
    // category: '',
    // subCategory: '',
    // url: '',
      
    // }
    // const hashArray = formData.hashtag
      // const hashobjects = hashArray.map((str, index) => ({ hashtag: hashtag str, id: index + 1 }));
      // const { hashdata } = await axios.post('/api/hashtags', hashobjects)
      // console.log(hashdata)
    console.log(formData)
    try {
      const { data } = await axios.post('/api/all-sounds', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      console.log(data._id)
      updateButton(!button)
      navigate(`/all-sounds/${data._id}`)
      // fetchSound()
      
    } catch (err) {
      console.log(err.response.data)
    }
  }

  // ! using a tenary statement to either display the images or image upload  
  return <>
    <div>
      <h1 className="title">CloudGram</h1>
      {button === true ?
        <div className="container">
          <button className="button" onClick={() => updateButton(!button)}>Back</button>
          <button className="button" onClick={handleUpload}>Click to upload your sound</button>
          <textarea
            className="textarea"
            placeholder='Describe your sound here...'
            onChange={handleChange}
            value={formData.caption}
            name="caption" 
            />
            
          <div className="media"> 
            
            <Select
              defaultValue={[]}
              name="category"
              placeholder='Select category'
              options={categoryType}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(categoryType) => setFormData({ ...formData, categoryType })}
              value={formData.categoryType}
            />
{/* 
              <input
                className="input"
                type="text"
                value={inputValue}
                onChange={handleChange}
                name={formData.hashtag}
              /> */}

            
          </div>
          
          
          <button className="button" onClick={handleSubmit}>Submit and return</button>
        </div>
        :
        <div>
          <button className="button" onClick={() => updateButton(!button)}>Click here to post your sound</button>
          {soundDisplay.map(sound => {
            return <div key={sound._id} className="column is-one-third-desktop is-half-tablet is-half-mobile">
              <div className="card">
                
                  <div className="media">
                  <Link to={`/all-sounds/${sound._id}`}>
              <div className="card">
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <h4 className="title is-4">
                        <span role="img" aria-label="plate">
                        </span>{" "}
                        <audio key={sound.url} controls className="media">
                          <source src={sound.url} type="audio/wav"></source>  
                        </audio>
                      </h4>
                      <h5 className="subtitle is-5">Track name: {sound.fileName}</h5>
                      <h5 className="subtitle is-5">Category: {sound.category}</h5>
                      <h5 className="subtitle is-5">Sub-category: {sound.subCategory}</h5>
                      <h5 className="subtitle is-5">
                  <span role="img" aria-label="plate">
                  </span>{" "}
                  Hashtags: {/* can we do a similar thing here with the show delete button if OP is true? We base this on if hashtags are present?  */}
                </h5> {sound.hashtag.map((tag, index) => {
                  return <article key={index} className="hashtag">
                    <div className="content">
                        <p className="subtitle">
                          #{tag}
                        </p>
                    </div>  
                  </article>
              })}
                    </div>
                  </div>
                </div>
                <div key={sound.user.image} className="card-image">
                  <figure className="image is-4by3">
                    <img src={sound.user.image} alt={sound.user.username} />
                  </figure>
                  <h5 className="subtitle is-5">User Posted: {sound.user.username}</h5>
                </div>
              </div>
            </Link>
                  </div>
                </div>
              </div>


          })}
        </div>
      }
    </div>
  </>
}


export default SoundCreate