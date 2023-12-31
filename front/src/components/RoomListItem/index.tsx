import React, { useState } from 'react';

import './style.css';
import RoomListResponseDto from '../../interfaces/response/room/room-list.response.dto';
import ChatComePopUP from '../PopUp/ChatComePopUp';

interface Props {
    onClick: () => void;
    item: RoomListResponseDto;
}

// component //
export default function RoomListItem({onClick, item} : Props) {

    // state //
    const { roomNumber, roomTitle, roomImageUrl } = item;
    const { roomMemberCount } = item;
    const { roomManagerNickname } = item;

    const roomImageBackground =  roomImageUrl ? { backgroundImage : `url(${roomImageUrl})` } : { backgroundColor : 'rgba(0, 0, 0, 0.6)' };

    // 채팅방 팝업창 상태 //
    const [popUpVisible, setPopUpVisible] = useState<boolean>(false);

    // function //

    // event handler //
    // 채팅방 입장 버튼 클릭 이벤트
    const onRoomEnterIconButtonClickHandler = () => {
        if (popUpVisible) setPopUpVisible(false);
        else setPopUpVisible(true);
    }

    // effect //

    // render //
    return (
        <div className='room-list' onClick={onClick}>
            <div className='room-list-room-profile' style={roomImageBackground}></div>
            <div className='room-list-room-title'>{roomTitle}</div>
            <div className='room-list-room-manager-nickname'>{roomManagerNickname}</div>
            <div className='room-list-room-member-count'>{`인원수 ${roomMemberCount}`}</div>
        </div>
        
    )
}
