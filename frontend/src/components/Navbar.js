
export default function Navbar() {
    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary py-4">
            <div class="container">
            <a class="navbar-brand" href="#">Speaking Crowd</a>
            <div>
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link fw-bold" aria-current="page" href="#">Teste Başla</a>
                </li>
                <li class="nav-item d-none d-sm-flex">
                    <a class="nav-link fw-bold" aria-current="page" href="#">Speaking Crowd Nedir?</a>
                </li>
                </ul>
            </div>
            </div>
        </nav>
    );
}