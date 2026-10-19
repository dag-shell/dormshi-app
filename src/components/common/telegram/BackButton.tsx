import { useEffect } from 'react';
import { backButton } from '@tma.js/sdk-react';
import { useNavigate } from 'react-router-dom';

/**
 * Component which controls the Back Button visibility.
 */
export function BackButton() {
    const navigate = useNavigate();
    if(!backButton.isMounted()) {
        backButton.mount()
    }

    useEffect(() => {
        backButton.show();

        // on click will nav to back page
        const offClick = backButton.onClick(() => {
            navigate(-1);
        });

        return () => {
            offClick();
            backButton.hide();
        };
    }, []);

    return null;
}