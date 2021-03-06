import React, {useState, useEffect }from 'react'
import { useHistory, useParams } from "react-router-dom";
import Loader from  "./Rolling-1s-200px.gif";

const userId = localStorage.id
const teamId = localStorage.teamId
const theme = localStorage.theme;

function MemberWall() {
    const { membId } = useParams();
    const [loading, setLoading] = useState(false);
    const [ posts, setPosts ]= useState([]);
    const [ comment, setComment ]= useState({});
    const [ members, setMembers ] = useState([]);
    const [ newPost, setNewPost ] = useState({ post:'', creatorId: `${userId}`, ownerId: `${membId}`});
    let history = useHistory();

    async function submitPost(){
        setLoading(true)
        console.log(' post content: ', newPost)
        if(newPost.post===''){
            setLoading(false)
            return
        }
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
        // loadMemberProfile();
        loadPosts()
        setLoading(false)
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
            if (a.upVotes.length === 0 ){
                let crA = a.created
                let crB = b.created
                return(crB>crA ? 1: -1)
            } else
            if (a.upVotes.length > 0 ){
                let crA = a.upVotes
                let crB = b.upVotes
                return(crB>crA ? 1: -1)
            }
        })
        let anotherObjArr = []
        sortingPosts.map(post=>
            { 
                let newPost = post
                post.likes.map(like=>{
                    if(like.frndId === userId){
                        newPost.frndId = like.frndId
                    }
                })
                post.upVotes.map(vote=>{
                    if(vote.frndId === userId){
                        newPost.voteId = vote.frndId
                    }
                })
                post.comments.map((comment, idx)=>{
                    comment.likes.map(like=>{
                        if(like.frndId === userId){
                            newPost.comments[idx].frndId = like.frndId
                        }
                    })
                })
                anotherObjArr.push(newPost)
            }
        )
        console.log('anotherObjArr: ', anotherObjArr)
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
        setLoading(true)
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
        loadPosts();
        setLoading(false)
    }
    async function upVotePost(postId){
        setLoading(true)
        const voteData={
            frndId: userId,
        }
        const apiResult = await fetch(`/api/upVotePost/${postId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(voteData)
            }).then( result => result.json());
        loadPosts();
        setLoading(false)
    }
    async function downVotePost(postId){
        setLoading(true)

        const voteData={
            frndId: userId,
        }
        const apiResult = await fetch(`/api/downVotePost/${postId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(voteData)
            }).then( result => result.json());
        loadPosts();
        setLoading(false)

    }
    async function likeComment(postId, commentId){
        setLoading(true)
        const likeCmntData={
            frndId: userId,
        }
        const apiResult = await fetch(`/api/likeComment/${postId}/${commentId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(likeCmntData)
            }).then( result => result.json());
        loadPosts();
        setLoading(false)

    }
    async function unLikeComment(postId, commentId){
        setLoading(true)

        const unlikeCmntData={
            frndId: userId,
        }
        const apiResult = await fetch(`/api/unLikeComment/${postId}/${commentId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(unlikeCmntData)
            }).then( result => result.json());
        loadPosts();
        setLoading(false)

    }
    async function unlikePost(postId){
        setLoading(true)
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
        setLoading(false)
    }
    async function commentPost(postId){
        setLoading(true)
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
        setLoading(false)
    }
    function directTo(name, id) {
        history.push(`/TeamDetail/${teamId}/MemberProfile/${name}/${id}/TimeLine`);
        document.location.reload(true);
    }
    useEffect(function(){
        // loadMemberProfile();
        loadPosts()
        loadMember()
    },[])
    return (
        <div >
            <div className={loading === true ? "loaderWindow": "hide"}>
                <div className="loadingWnd">
                    <img className="loadingGif" src={Loader} alt="loadingWndow"/>
                </div>
            </div>
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
                        <img src={member.profileImg} alt="membImage" className="postImgThmb mt-2 cursor" onClick={()=>directTo(member.name, member._id)}/>
                        <div className="postDetail">
                            <h5 className="cursor" onClick={()=>directTo(member.name, member._id)}>{member.name}</h5>
                            <p className="postTime " > {post.created}</p>
                        </div>
                    </div>
                        : ''
                    )}
                    <div className="postTxt">{post.post}</div>
                    <hr/>
                    <div className="d-flex col-10 justify-content-between">
                        <div className="likeSect d-flex">
                            {
                            post.frndId ? <div onClick={()=>unlikePost(post._id)}><i class="onHvr2 fas fa-2x fa-heart"></i></div> : <div onClick={()=>likePost(post._id)}><i class="onHvr far fa-2x fa-heart"></i></div>
                            }
                            <div className="pl-2">
                                {post.likes.length > 1 ? <div className="pl-2">{post.likes.length} likes</div> : <div>{post.likes.length} like</div>
                            }
                            </div>
                        </div>
                        <div className="like pl-2 pt-1 mx-auto d-flex">
                        {
                            post.voteId ? <div onClick={()=>downVotePost(post._id)}><i class="onHvr fas fa-2x fa-arrow-circle-down"></i></div> : <div onClick={()=>upVotePost(post._id)}><i class="onHvr fas fa-2x fa-arrow-circle-up"></i></div>
                            
                        }
                        <p className=" mx-auto">{post.upVotes.length>0? post.upVotes.length : ''}</p>
                            {/* <div onClick={()=>upVotePost(post._id)}><i class="onHvr fas fa-2x fa-arrow-circle-up"></i></div>
                            <div onClick={()=>downVotePost(post._id)}><i class="onHvr fas fa-2x fa-arrow-circle-up"></i></div> */}
                        </div>
                        <div className="d-flex onHvr text-left">
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
                                <div className="postCmntDrk col-8">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex col-10 border">
                                            <img src={mem.profileImg} alt="membImage" className="cmntImgThmb mt-2 cursor" onClick={()=>directTo(mem.name, mem._id)}/>
                                            <div>
                                                <h6 className="cursor" onClick={()=>directTo(mem.name, mem._id)}>{mem.name}</h6>
                                                <p className="postTime"> {comment.created}</p>
                                                <h5 className="text-left">{comment.comment} </h5>
                                            </div>
                                        </div>
                                        <div className="like pr-2 pt-2 d-flex mx-auto">
                                        {
                                            comment.frndId ? <div onClick={()=>unLikeComment(post._id, comment._id)} className="mx-auto"><i class="onHvr2 fas fa-heart" style={{fontSize: "1.5rem"}}></i></div> : <div onClick={()=>likeComment(post._id, comment._id)} className="mx-auto"><i class="onHvr far fa-heart"  style={{fontSize: "1.5rem"}}></i></div>
                                        }
                                        <p className=" mx-auto">{comment.likes.length>0? comment.likes.length : ''}</p>
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
