import React from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as GiIcons from 'react-icons/gi';
import * as BiIcons from 'react-icons/bi';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';

export const UserSidebarData = [
    {
        title: 'Election Details',
        path: '/ElectionDetails',
        icon: <AiIcons.AiFillInfoCircle />,
        cName: 'User-nav-text'
    },
    {
        title: 'Registration',
        path: '/registration',
        icon: <FaIcons.FaRegAddressCard />,
        cName: 'User-nav-text'
    },
    {
        title: 'Vote',
        path: '/vote',
        icon: <GiIcons.GiVote />,
        cName: 'User-nav-text',
    },
    {
        title: 'Results',
        path: '/results',
        icon: <GiIcons.GiStarFlag />,
        cName: 'User-nav-text'
    },
    {
        title: 'Logout',
        path: '/logout',
        icon: <BiIcons.BiLogOut />,
        cName: 'User-nav-text'
    },


];

export const AdminSidebarData = [
    {
        title: 'Create Election',
        path: '/CreateElection',
        icon: <AiIcons.AiFillReconciliation />,
        cName: 'nav-text'
    },
    {
        title: 'Add Candidate',
        path: '/Addcandidate',
        icon: <BsIcons.BsFillPersonPlusFill />,
        cName: 'nav-text'
    },
    {
        title: 'Candidate Details',
        path: '/candidateInfo',
        icon: <FaIcons.FaUserTie />,
        cName: 'nav-text'
    },
    {
        title: 'Verification',
        path: '/register',
        icon: <RiIcons.RiUserFollowFill />,
        cName: 'nav-text'
    },
    {
        title: 'Logout',
        path: '/logout',
        icon: <BiIcons.BiLogOut />,
        cName: 'nav-text'
    },


];

