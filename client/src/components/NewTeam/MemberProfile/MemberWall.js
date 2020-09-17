import React, {useState, useEffect, useRef }from 'react'
import {  useParams , Link } from "react-router-dom";

const userId = localStorage.id
const teamId = localStorage.teamId
const userType = localStorage.type
const theme = localStorage.theme;


function MemberWall() {
    const { membId } = useParams();
    const [ memberDetail, setMemberDetail ]= useState({});
    const [ posts, setPosts ]= useState([]);
    const [ comments, setComments ]= useState([]);
    const [ noLike, setNoLike ]= useState(true);
    const [ liked, setLiked ]= useState(false);
    const [ userLike, setUserLike ]= useState(false);
    const [ likedObj, setLikedObj]= useState([])
    const [ myLikes, setMyLikes ]= useState([]);
    const [ comment, setComment ]= useState({});
    const [ members, setMembers ] = useState([]);
    const [ newPost, setNewPost ] = useState({ post:'', creatorId: `${userId}`, ownerId: `${membId}`});
    async function submitPost(){
        console.log(' post content: ', newPost)
        const apiResult = await fetch(`/api/postPost/${membId}`, 
            {   method: 'post',
                headers:{
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost)
            }).then( result => result.json());
        // console.log('friend added: ', apiResult.message)
        setNewPost({ post:'', creatorId: `${userId}`, ownerId: `${membId}`})
        loadMemberProfile();
        loadPosts()
    }
    async function loadMemberProfile(){
        const getEmpDetail = await fetch (`/api/memberProfile/${membId}`).then( res => res.json());
        setMemberDetail(getEmpDetail);
    }
    async function loadMember(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        setMembers(fetchMembers)
    }
    async function loadPosts(){
        const getPosts = await fetch (`/api/loadPosts/${membId}`).then( res => res.json());
        console.log(' fetched POSTS: ', getPosts)
        const sortingPosts = getPosts.sort(function(a,b){
            let crA = a.created
            let crB = b.created
            return(crB>crA ? 1: -1)
        })
        let myLikes = []
        let otherLikes = []
        let likedObjArr = []
        let anotherObjArr = []
        sortingPosts.map(post=>
            { 
                let newPost = post
                post.likes.map(like=>{
                    if(like.frndId === userId){
                        newPost.frndId = like.frndId
                    }
                })
                anotherObjArr.push(newPost)
            }
        )
        console.log('anotherObjArr: ', anotherObjArr)
        setLikedObj(likedObjArr)
        setPosts(anotherObjArr);
        
    }
    function handleInputChange( e ){
        const { id, value } = e.target; 
        setNewPost( { ...newPost, [id]: value } );
        }
    function hndleCmntInptChnge( e ){
        const { id, value } = e.target; 
        setComment( {value} );
        }
    async function likePost(postId){
        const likeData={
            frndId: userId,
        }
        const apiResult = await fetch(`/api/likePost/${postId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(likeData)
            }).then( result => result.json());
        console.log('post liked ', apiResult.message)
        loadPosts();
    }
    async function unlikePost(postId){
        const unlikeData={
            frndId: userId,
        }
        const apiResult = await fetch(`/api/unLikePost/${postId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(unlikeData)
            }).then( result => result.json());
        console.log('post unliked ', apiResult.message)
        loadPosts();
    }
    async function commentPost(postId){
        console.log('comment: ', comment);
        const commentData={
            commenterId: userId,
            comment: comment.value
        }
        console.log('commentData: ', commentData);
        const apiResult = await fetch(`/api/postComment/${postId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            }).then( result => result.json());
            setComment({comment:''})
            loadPosts();
    }
    useEffect(function(){
        loadMemberProfile();
        loadPosts()
        loadMember()
    },[])
    return (
        <div >
            <div className={ theme === 'Dark' ? " myCardDark  mx-auto" : " myCard mx-auto"}>
                <div class="form-group">
                    <textarea
                    value={newPost.post} 
                    onChange={handleInputChange} 
                    id="post"
                    className="col" style={ theme === 'Dark' ? {background: "#343a40"} : {background: "#e4e1e1"}}>{newPost.post}</textarea>
                    <div className="myBtnNew" onClick={submitPost}>Post</div>
                </div>
            </div>
            {
                posts.map((post, idx)=>
            <div key={`post${idx}`} className={ theme === 'Dark' ? " myCardDark  mx-auto" : " myCard mx-auto"}>
                <div className="post">
                    {members.map(member=>
                        member._id === post.creatorId ?
                    <div className="d-flex">
                        <Link to={`/TeamDetail/${teamId}/MemberProfile/${member.name}/${member._id}`} ><img src={member.profileImg} alt="membImage" className="postImgThmb mt-2"/></Link>
                        <div className="postDetail">
                            <h5>{member.name}</h5>
                            <p className="postTime"> {post.created}</p>
                        </div>
                    </div>
                        : ''
                    )}
                    <div className="postTxt">{post.post}</div>
                    <hr/>
                    <div className="d-flex col-10 justify-content-between border">
                        <div className="likeSect border d-flex">
                        {
                            post.frndId ? <div onClick={()=>unlikePost(post._id)}><i class="onHvr2 fas fa-2x fa-heart"></i></div> : <div onClick={()=>likePost(post._id)}><i class="onHvr far fa-2x fa-heart"></i></div>
                        }
                        <div className="pl-2">
                            {post.likes.length > 1 ? <div className="pl-2">{post.likes.length} likes</div> : <div>{post.likes.length} like</div>
                        }
                        </div>


                        </div>
                        <div className="d-flex onHvr border text-left">
                            <i class="fas fa-2x fa-comments"></i>
                            { post.comments.length == 0 ? '' : 
                                post.comments.length > 1 ?  <p className="pb-2 pl-2">{post.comments.length} Comments</p> : <p className="pb-2 pl-2">{post.comments.length} Comment </p> 
                            }
                        </div>
                    </div>
                    <hr/>
                    <div className="d-flex">
                        <input onChange={hndleCmntInptChnge} className="comment" type="text" id={`comment-${idx}`} name="fname" value={comment.comment} style={ theme === 'Dark' ? {background: "#343a40"} : {background: "#e4e1e1"}}/>
                        <div className="myBtnNew2" onClick={()=>commentPost(post._id)}>comment</div>
                    </div>
                    <hr/>
                    {post.comments.map(comment=>
                        <div>
                            {members.map(mem=>
                                mem._id === comment.commenterId ?
                                <div className="postCmntDrk">
                                    <div className="d-flex">
                                        <Link to={`/TeamDetail/${teamId}/MemberProfile/${mem.name}/${mem._id}`} ><img src={mem.profileImg} alt="membImage" className="cmntImgThmb mt-2"/></Link>
                                        <div>
                                            <h6>{mem.name}</h6>
                                            <p className="postTime"> {comment.created}</p>
                                            <h5 className="text-left">{comment.comment} </h5>
                                        </div>
                                    </div>
                                    
                                </div>

                                :''
                                )}

                        </div>
                        )}

                </div>
            </div>
            )}

        </div>
    )
}

export default MemberWall
