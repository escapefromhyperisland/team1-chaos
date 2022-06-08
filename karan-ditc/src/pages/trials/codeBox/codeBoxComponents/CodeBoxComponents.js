import styled, {keyframes} from 'styled-components'
import safewheel from '../../../../images/safewheel.png'
import safewheelGreen from '../../../../images/safewheelGreen.png'
import wallbg from '../../../../images/wallbg.jpg'
import woodbg from '../../../../images/woodbg.jpg'
import visitorbook from '../../../../images/visitorbook.png'

export const rotateDoor = keyframes` 
from { transform: rotateY(0deg); }
to { transform: rotateY(120deg); }
` 
export const rotateWheel = keyframes`
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
`
export const rotateAndHide = keyframes`
0% { transform: rotate(0deg); }
50% { transform: rotate(360deg); }

51% { opacity: 1; }
100%{ opacity: 0; }
`
export const hide = keyframes`

from { opacity: 1; }
to { opacity: 0; }
`
export const show = keyframes`
from { opacity: 0; }
to { opacity: 1; }
`
export const highlight = keyframes`
from { width: 100px; }
to { width: 110px; }
`
const fadeIn = keyframes`
0% { opacity: 0;}
100% { opacity: 1;}
`


export const Container = styled.div`
grid-area: conversation;
display: flex;
flex-direction: column;
width: 100%;
overflow: hidden;

@media(min-width:1025px){
    flex-direction: row;
    justify-content: space-between;
}
`

export const StyledInput = styled.input`
width: 2em;
background-color: ${({safeCodeBgColor})=>safeCodeBgColor};
margin-right: .2em;
border-radius: .2em;
`
export const CodeBoxContainer = styled.div`
width: 100%;
border: 1px solid black;
background-color: whitesmoke;
background-image: url(${wallbg});
background-size: cover;
padding: 2em 2em 0 2em;
margin: 1em auto;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-end;

@media(min-width:1025px){
    min-width: 50%;
    width: 50%;
    padding: 5em;
    margin: 1em;
    border: 4px solid #141414;
    border-radius: 5px;
}
`
const SafeBox = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-evenly;
min-height: 300px;
min-width: 300px;
height: 300px;
width: 300px;
background-color: #333;
border-radius: 30px;
`
const SafeBoxDoor = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-evenly;
background-color: #333;
border: 3px solid #999;
min-height: 240px;
min-width: 240px;
height: 240px;
width: 240px;
border-radius: 20px;
position: relative;
animation: ${({codeIsCorrect})=>codeIsCorrect ? rotateDoor : null} 3s;
transform-origin: right;
transform-style: preserve-3d;
animation-fill-mode: forwards;
`
const SafeBoxInside = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-evenly;
background-color: #666;
border: 3px solid #999;
min-height: 220px;
min-width: 220px;
height: 220px;
width: 220px;
border-radius: 20px;
position: relative;
z-index: 2;
`
const SafeWheel = styled.div`
background-color: #666;
min-height: 100px;
min-width: 100px;
height: 100px;
width: 100px;
background-image: url(${safewheel});
background-image: url(${({codeBoxIsFull})=> codeBoxIsFull ? safewheelGreen : safewheel });
background-size: cover;
background-repeat: none;
clip-path: circle(50% at 50% 50%);
animation: ${({codeIsCorrect})=>codeIsCorrect ? rotateAndHide : rotateWheel} 2s;
animation-fill-mode: forwards;
animation-delay: 0;
`
const ChildrenContainer = styled.div`
animation: ${({codeIsCorrect})=>codeIsCorrect ? hide : null} .2s;
animation-fill-mode: forwards;
animation-delay: 1.2s;
`
const SafeFeetOuter = styled.div`
display: flex;
justify-content: space-between;
min-height: 20px;
min-width: 240px;
height: 20px;
width: 240px;
`
const SafeFeet = styled.div`
height: 0;
width: 30px;
border-bottom: 20px solid #202020;
border-left: 10px solid transparent;
border-right: 10px solid transparent;
`
const Base = styled.div`
height: 100px;
min-height: 100px;
width: 100%;
min-width: 100%;
background-color: brown;
background-image: url(${woodbg});
background-size: cover;
`
const SafeHinge = styled.div`
position: absolute;
right: -7px;
top: ${({top})=> top}px;
height: 20px;
width: 10px;
min-height: 20px;
min-width: 10px;
background-color: #999;
`
export const StyledFoundArtefact = styled.div`
position: absolute;
opacity: 0;
right: 0;
margin: 5%;
width: auto;
font-size: 1.3rem;
padding: 1em 0 0 0;
text-align: center;
animation: ${fadeIn} 1s;
animation-delay: .1s;
animation-fill-mode: forwards;
border-radius: 5px;


@media(min-width:400px){
    position: unset;
}

`

const Notes = styled.div`
background-image: url(${visitorbook});
background-size: contain;
background-repeat: no-repeat;
background-position: center;
position: absolute;
z-index: -1;
opacity: 0;
min-height: 200px;
min-width: 100px;
height: 200px;
width: 100px;
animation: ${({codeIsCorrect})=>codeIsCorrect ? show : null} .1s forwards .7s, ${({codeIsCorrect})=>codeIsCorrect ? highlight : null} 1s infinite alternate .7s;
cursor: pointer;

:hover{
    height: 210px;
width: 110px;
}
`


export const Safe = ({ children, ...props }) => {
    return <><SafeBox><SafeBoxInside><Notes {...props} onClick={props.handleVisitorBookClick}/><SafeBoxDoor {...props}><SafeWheel codeBoxIsFull={props.codeBoxIsFull} onClick={props.handleCheckCorrectCode}{...props}/><ChildrenContainer {...props}>{children}</ChildrenContainer><SafeHinge top="190"/><SafeHinge top="25"/></SafeBoxDoor></SafeBoxInside></SafeBox><SafeFeetOuter><SafeFeet /><SafeFeet /></SafeFeetOuter><Base/></>
}

