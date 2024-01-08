import { toRefs } from "vue";


const tableClick = {
    mounted (el, bingdings) {
        const {
            userList,
            status,
            field,
            index,
            socket
        } = toRefs(bingdings.value);
        tableClick.el = el;
        tableClick.userList = userList;
        tableClick.status = status;
        tableClick.field = field;
        tableClick.index = index;
        tableClick.socket = socket.value;
        bindEvent();
    }
}

function bindEvent () {
    tableClick.el.addEventListener('click', handleTableClick, false);
    window.addEventListener('click', handleWindowClick, false);
}

function handleTableClick(e) {
    handleStopPropagation(e);
    handleWindowClick(e);
   tableClick.topTarget = getTarget(e);
   const topTarget = tableClick.topTarget;
   const field = topTarget.dataset.field;
   if (field) {
       const index = topTarget.dataset.index;
       const tdText = topTarget.innerText;
       tableClick.oInput = createInput(tdText);
       topTarget.appendChild(tableClick.oInput);
       tableClick.oInput.select();
       tableClick.field.value = field;
       tableClick.index.value = index;
       bindInputEvent();
       tableClick.socket.emit('changeStatus', true);
   }
}

function handleStopPropagation(e) {
    e.stopPropagation();
}

function bindInputEvent () {
    tableClick.oInput.addEventListener('click', handleStopPropagation, false);
    tableClick.oInput.addEventListener('input', handleInput, false);
}
function unbindInputEvent() {
    tableClick.oInput.removeEventListener('click', handleStopPropagation, false);
    tableClick.oInput.addEventListener('remove', handleInput, false);
}
function createInput (value) {
    const oInput = document.createElement('input');
    oInput.value = value;
    oInput.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
    `
    return oInput;
}

function removeInput() {
    tableClick.topTarget.removeChild(tableClick.oInput);
    unbindInputEvent();
    tableClick.oInput = null;
    tableClick.topTarget = null;
    tableClick.socket.emit('changeStatus', false);
}

function handleWindowClick () {
    if (tableClick.oInput) {
        updateUserList(tableClick.oInput.value);
        removeInput();
    }
}

function handleInput (e) {
    updateUserList(e.target.value);
}

function updateUserList(value) {
    tableClick.socket.emit('changeData', {
        field: tableClick.field.value,
        index: tableClick.index.value,
        value
    });
}
function getTarget(e) {
    const tagName = e.target.tagName.toLowerCase();
    switch(tagName) {
        case 'span':
            return e.target.parentNode;
        case 'td':
            return e.target;
        default:
            return e.target;
    }
}

export default tableClick;