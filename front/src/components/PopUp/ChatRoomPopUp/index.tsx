import React, { Dispatch, SetStateAction, useState, ChangeEvent, useRef, useEffect } from 'react'
import './style.css'; 
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CHAT_PATH, MAIN_PATH, ROOM_PATH } from '../../../constants';
import useCreateRoomStore from 'src/store/room.store';
import { Cookies, useCookies } from 'react-cookie';
import path from 'path';
import PostRoomRequestDto from 'src/interfaces/request/room/post-room.request.dto';
import { postRoomRequest } from 'src/apis';

//            component           //
// description : 채팅방 만들기 팝업창 // 
export default function ChatRoomPopUp() {
//            state           //
// description : 네비게이터 //
const navigator = useNavigate();

const {userEmail} = useParams();

// todo : 상태 string / boolean 확인 잘하기, 받아오는 값 //
// description : 방 이름 상태 //
const [roomName, setRoomName] = useState<string>('');
// description : 방 비밀번호 상태 //
const [roomPassword, setPassword] = useState<string>('');
// description : 방 이름 에러 상태 //
const [roomNameError, setRoomNameError] = useState<boolean>(false);
// description : 방 비밀번호 에러 상태 //
const [roomPasswordError, setRoomPasswordError] = useState<boolean>(false);

// description : 파일 업로드 버튼 요소에 대한 참조 상태 //
const fileInputRef = useRef<HTMLInputElement>(null);

const [cookies] = useCookies();

const { pathname } = useLocation();

// 채팅방 정보를 저장할 상태 //
const {roomTitle, roomCreatePassword, roomImage, setRoomTitle, setRoomCreatePassword, setRoomImage, resetRoom} = useCreateRoomStore();
// 이미지를 저장할 상태 //
const [roomImageUrl, setRoomImageUrl] = useState<string>('')

//            function           //
const postRoomResponseHandler = (code : string) => {
  if(code === "NE") alert('존재하지 않는 사용자 이메일입니다.');
  if(code === "VF") alert('필수 데이터를 입력하지 않았습니다.');
  if(code === 'DE') alert('데이터베이스 에러입니다.');

  resetRoom();
  
}

//            event handler           //
// description : 방 이름 변경 이벤트 처리 함수 //
const onRoomNameHandler = (event: ChangeEvent<HTMLInputElement>) => {
  const roomName = event.target.value;
  setRoomName(roomName);
}

// description : 방 비밀번호 변경 이벤트 처리 함수 //
const onRoomPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
  const roomPassword = event.target.value;
  setPassword(roomPassword);
}

// description : 채팅방 만들기 생성 클릭 이벤트 //
// todo : 이동 위치 확인해서 수정하기 //
const onCreateClickHandler = async () => {
  const token = cookies.accessToken;

  if(pathname === MAIN_PATH) {
    const data : PostRoomRequestDto = {
        roomTitle: roomTitle,
        roomImage: null,
        roomImageUrl: null,
        roomPassword: roomPassword
    }
    postRoomRequest(data, token).then(postRoomResponseHandler);
  }

  navigator(CHAT_PATH);

}
// description : 채팅방 만들기 취소 클릭 이벤트 //
const onCancelClickHandler = () => {
  navigator(MAIN_PATH);
}
// description : 파일 업로드 버튼 클릭 이벤트 //
const onFileUploadClickHandler = () => {
  if(!fileInputRef.current) return;
  fileInputRef.current.click();
}

//            component           //
//            effect           //
useEffect(() => {
  if (!userEmail) navigator(MAIN_PATH);

  return;
}, [userEmail]);
//            render           //
  return (
    <div id='popup-wrapper'>
      <div className='popup-header'>
        <div className='popup-header-title'>Code Matchr</div>
      </div>
      <div className='popup-main'>
        <div className='popup-main-box'>
          <div className='popup-main-box-top'>
            <div className='popup-main-top-title'>채팅방 만들기</div>
            <div className='popup-main-top-image-box'>
              <div className='popup-main-image-text'>채팅방 이미지 업로드</div>
              <div className='popup-main-image-button' onClick={onFileUploadClickHandler}>
              <input ref={fileInputRef} type='file' accept='image/*' style={{ display: 'none' }}/>
              </div>
            </div>
          </div>
          <div className='popup-main-box-bottom'>
            <div className='popup-main-bottom-room-name-box'>
              <div className='popup-main-bottom-room-name'>방 이름</div>
              {roomNameError ? 
                <input className='popup-main-bottom-room-name-input-error' type='text' placeholder='방 이름을 입력해주세요.' onChange={onRoomNameHandler}/>
                :
                <input className='popup-main-bottom-room-name-input' type='text' placeholder='방 이름을 입력해주세요.' onChange={onRoomNameHandler}/>
              }
            </div>
            <div className='popup-main-bottom-room-input-error-box'>
              {roomNameError ? 
              <div className='popup-main-bottom-room-input-name-error'>채팅방 이름을 입력하지 않았습니다. 다시 입력해주세요.</div>
              :
              <></>}
            </div>
            <div className='popup-main-bottom-room-password-box'>
              <div className='popup-main-bottom-room-password'>비밀번호</div>
              {roomPasswordError ? 
              <input className='popup-main-bottom-room-password-input-error' type='text' placeholder='방 비밀번호를 입력해주세요.' onChange={onRoomPasswordHandler} />
              :
              <input className='popup-main-bottom-room-password-input' type='text' placeholder='방 비밀번호를 입력해주세요.' onChange={onRoomPasswordHandler} />
              }
            </div>
            <div className='popup-main-bottom-room-input-error-box'>
              {roomPasswordError ? 
              <div className='popup-main-bottom-room-input-password-error'>비밀번호를 입력하지 않았습니다. 다시 입력해주세요.</div> 
              :
              <></>}
            </div>
            <div className='popup-main-bottom-button-box'>
              <button className='popup-main-bottom-button-create' onClick={onCreateClickHandler} >생성</button>
              <button className='popup-main-bottom-button-cancel' onClick={onCancelClickHandler} >취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )      
}
