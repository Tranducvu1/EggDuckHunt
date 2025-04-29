import { initialize } from "./components/ContractActions.js";

document.addEventListener('DOMContentLoaded', function () {
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const nameInput = document.getElementById('nameInput');
    const profilePopup = document.getElementById('profilePopup');
    const shortAddress = document.getElementById('shortAddress');
    const balanceElement = document.getElementById('balance');
    const logoutButton = document.getElementById('logoutButton');
    const avatar = document.getElementById('avatar');

    let web3;
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                const userAddress = accounts[0];
                const shortAddressText = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
                sessionStorage.setItem('userAddress', userAddress);
                sessionStorage.setItem('shortAddress', shortAddressText);
                const storedName = localStorage.getItem(`walletName_${userAddress}`);
                if (storedName) {
                    sessionStorage.setItem('userName', storedName);
                    sessionStorage.setItem('userInitial', storedName.charAt(0).toUpperCase());
                }
                refreshBalance();
            } else {
                handleLogout();
            }
        });
    }

    const updatePlayerName = async (address, newName) => {
        try {
            const response = await fetch(`http://localhost:7272/api/v1/player/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: address, name: newName })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Cannot update name: ${response.status} ${errorText}`);
            }
            return true;
        } catch (error) {
            console.error("Error in updatePlayerName:", error);
            return false;
        }
    };

    const refreshBalance = async () => {
        if (!web3) {
            console.error('Web3 not initialized. Please ensure MetaMask is installed.');
            return;
        }

        try {
            const userAddress = sessionStorage.getItem('userAddress');
            if (!userAddress) {
                console.warn('No user address found in sessionStorage');
                return;
            }

            const weiBalance = await web3.eth.getBalance(userAddress);
            const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
            const balance = parseFloat(ethBalance).toFixed(4);
            balanceElement.textContent = balance;
            sessionStorage.setItem('userBalance', balance);
        } catch (error) {
            console.error('Error refreshing balance:', error);
            balanceElement.textContent = '0';
        }
    };

    const loadUserData = () => {
        const storedAddress = sessionStorage.getItem('shortAddress');
        const storedBalance = sessionStorage.getItem('userBalance');
        const storedInitial = sessionStorage.getItem('userInitial');
        const fullAddress = sessionStorage.getItem('userAddress');

        let storedName = sessionStorage.getItem('userName');
        if (!storedName && fullAddress) {
            storedName = localStorage.getItem(`walletName_${fullAddress}`);
            if (storedName) {
                sessionStorage.setItem('userName', storedName);
                sessionStorage.setItem('userInitial', storedName.charAt(0).toUpperCase());
            }
        }

        userName.textContent = storedName || 'Guest';
        shortAddress.textContent = storedAddress || 'Not connected';
        balanceElement.textContent = storedBalance || '0';
        avatar.textContent = storedInitial || storedName?.charAt(0).toUpperCase() || 'G';

        userProfile.style.display = 'flex';

        if (fullAddress) {
            refreshBalance();
        }
    };

    const handleLogout = () => {
        sessionStorage.setItem('loggedOut', 'true');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userAddress');
        sessionStorage.removeItem('shortAddress');
        sessionStorage.removeItem('userBalance');
        sessionStorage.removeItem('userInitial');
        window.location.href = '../index.html';
    };

    const handleEditName = () => {
        userName.style.display = 'none';
        nameInput.style.display = 'block';
        nameInput.value = userName.textContent;
        nameInput.focus();
    };

    const handleSaveName = async () => {
        const newName = nameInput.value.trim();
        if (newName !== '') {
            const userAddress = sessionStorage.getItem('userAddress');
            if (userAddress) {
                try {
                    localStorage.setItem(`walletName_${userAddress}`, newName);
                    const updateSuccess = await updatePlayerName(userAddress, newName);
                    if (!updateSuccess) {
                        throw new Error('Failed to update name in database');
                    }
                    userName.textContent = newName;
                    avatar.textContent = newName.charAt(0).toUpperCase();
                    sessionStorage.setItem('userName', newName);
                    sessionStorage.setItem('userInitial', newName.charAt(0).toUpperCase());
                    sessionStorage.setItem('loggedOut', 'false');
                    nameInput.style.display = 'none';
                    userName.style.display = 'block';
                } catch (error) {
                    console.error('Error updating name:', error);
                }
            }
        }
    };

    loadUserData();
});
