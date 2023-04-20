import { useMediaQuery } from 'react-responsive';

const useBreakpoints = () => {
    const sm = useMediaQuery({ minWidth: 640 });
    const md = useMediaQuery({ minWidth: 768 });
    const lg = useMediaQuery({ minWidth: 1024 });
    const xl = useMediaQuery({ minWidth: 1280 });
    const xxl = useMediaQuery({ minWidth: 1536 });

    return { sm, md, lg, xl, xxl };
};

export default useBreakpoints;
