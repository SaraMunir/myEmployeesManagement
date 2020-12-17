import React,{useState, useEffect} from 'react';
import { Doughnut, Bar  } from 'react-chartjs-2';
import { PolarArea } from '@reactchartjs/react-chart.js'
function MyCharts(props) {
    const theme = localStorage.theme;

    const [maleMembNumb2, setMaleMembNumb2] = useState()
    const [data, setData] =useState({})
    const [roleData, setRoleData] =useState({})
    const [options, setOptions]=useState({
        legend: {
            labels: {
                // This more specific font property overrides the global property
                fontColor: '#3e444b',
            }
        }
    })
    const [optionsDark, setOptionsDark]=useState({
        legend: {
            labels: {
                // This more specific font property overrides the global property
                fontColor: 'white',
            }
        }
    })
    async function loadMember2(){
        var membArr=[]
        var roleObjArr=[]
        var roleLabels=[]
        var roleData=[]
        var maleMembNum = 0
        var femaleMembNum = 0
        var otherMembNum = 0
        const fetchMembers = await fetch (`/api/member/${props.teamId}`).then( res => res.json());
        const fetchRoles = await fetch (`/api/allRoles/${props.teamId}`).then( res => res.json());
        fetchRoles.teamRoles.map(role=>{
            let roleObj = {
                roleName : role.roleName,
                num: 0
            }
            roleLabels.push(role.roleName)
            roleObjArr.push(roleObj)
        })
        fetchMembers.map((member)=>{
            if(member.sex==='M'){
                maleMembNum += 1
            }
            if(member.sex==='F'){
                femaleMembNum += 1
            }
            if(member.sex==="Other"){
                otherMembNum += 1
            }
            roleObjArr.map(role=>{
                if (member.role === role.roleName){
                    role.num =  role.num + 1
                }
            })
        });
        roleObjArr.map(role=>{
            roleData.push(role.num)
        })
        membArr.push(maleMembNum)
        membArr.push(femaleMembNum)
        membArr.push(otherMembNum)
        setData({
            labels: ['Male', 'Female', 'Other'],
            datasets:[
                {
                    label:'Gender ratio',
                    data:membArr,
                    backgroundColor:[
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 99, 132, 0.6)'
                    ],
                    borderWidth: 1,
                    }
                ]
            })
        setRoleData({
            labels: roleLabels,
            datasets:[
                {
                    label:roleLabels,
                    data:roleData,
                    backgroundColor:[
                        '#d363ff99',
                        '#4042b499',
                        '#63d3ff99',
                        '#63ffcb99',
                        '#63ff7099',
                        '#e2ff6399',
                        '#ffbb6398',
                        '#ff756398'
                    ]
                    }
                ]
        })
        setMaleMembNumb2(maleMembNum)
    }

    const maleNum = parseInt(props.maleMembNumb)
    useEffect(function(){
        loadMember2()
    },[])

    return (
        <div className='row mx-auto' >
            <div className="col-6 mx-auto">
                <Doughnut data={roleData} options={theme === 'Dark' ?optionsDark : options}/>
                <h4>Roles</h4>
            </div>
            <div className="col-6 mx-auto">
                <PolarArea data={data} options={theme === 'Dark' ?optionsDark : options}/>
                <h4>Gender</h4>
            </div>
        </div>
    )
}

export default MyCharts
