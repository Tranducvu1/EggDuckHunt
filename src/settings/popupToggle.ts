const bagIcon = document.querySelector(".icon-bag") as HTMLElement;  // Get the bag icon element
const contractIcon = document.querySelector(".icon-contract") as HTMLElement;  // Get the contract icon element
const settingsBtn = document.getElementById('settingvolumnsBtn') as HTMLElement | null;
const taskIcon = document.querySelector(".icon-task") as HTMLElement;  // Get the popup element

const bagPopup = document.getElementById('bagPopup') as HTMLElement | null;
const contractPopup = document.getElementById('contractPopup') as HTMLElement | null;
const taskPopup = document.getElementById('taskPopup') as HTMLElement | null;
const settingsMenu = document.getElementById('settingsMenuVolumn') as HTMLElement | null;
/*
    hide all after click one pop up
*/
function closeAllPopup() : void {
    if (bagPopup) bagPopup.style.display = 'none';  // Hide the bag popup
    if (contractPopup) contractPopup.style.display = 'none';  // Hide the contract popup
    if (taskPopup) taskPopup.style.display = 'none';  // Hide the task popup
    if (settingsMenu)  settingsMenu.style.display = 'none';  // Hide the settings menu
}

bagIcon?.addEventListener('click',() => {
    const isOpen = bagPopup?.style.display === 'block';
    closeAllPopup();
    if (bagPopup) {
        bagPopup.style.display = isOpen ? 'block' : 'none';
    }

})

contractIcon.addEventListener('click',()=>{
    const isOpen = contractPopup?.style.display === 'block';
    closeAllPopup();
    if(contractPopup) contractPopup.style.display = isOpen ? 'block' : 'none';
})

taskIcon?.addEventListener('click', () => {
    const isOpen = taskPopup?.style.display === 'block';
    closeAllPopup();
    if (taskPopup) taskPopup.style.display = isOpen ? 'block' : 'none';
});

settingsBtn?.addEventListener('click', () => {
    const isOpen = settingsMenu?.style.display === 'block';
    closeAllPopup();
    if (settingsMenu) settingsMenu.style.display = isOpen ? 'block' : 'none';
});