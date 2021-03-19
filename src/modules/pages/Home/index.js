import { Link } from 'react-router-dom';
import Button from 'modules/components/Button';
import AppShell from 'modules/components/App/AppShell';

const Home = () => {
    return (
        <AppShell>
            <h1>Home Page</h1>
            <div>add app shell</div>
            <Link to="/quiz-mood">
                <Button>Mood Quiz</Button>
            </Link>
        </AppShell>
    )
}

export default Home;