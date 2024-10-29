export default function Home() {
    return (
        <div>
            <div className="bg-body-secondary">
                <div className="container">
                    <div class="row align-items-center min-vh-100">
                        <div class="col">
                        <h1 className="mb-5">Speaking Crowd testleriyle kolayca ingilizce öğrenin</h1>
                        <p>
                            Speaking Crowd test yapısıyla kolayca ingilizce öğrenebileceğiniz bir platformdur.
                            Karmaşık sorularını belli bir sürenin altında cevaplanamanızı sağlayarak size dil pratiği yaptırır ve ingilizcenizi geliştirir.
                            Deneme testine hemen başlayabilirsiniz.
                        </p>
                        </div>
                        <div class="col-xl-6 col-sm-12 text-end">
                        <img src="./main-banner.png" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="container">
                    <div class="row align-items-center min-vh-100">
                        <div class="col text-start">
                        <img src="./main-banner.png"  class="w-50" />
                        </div>
                        <div class="col-xl-6 col-sm-12">
                        <h1 className="mb-5">Speaking Crowd Nedir?</h1>
                        <p>
                            Speaking Crowd test yapısıyla kolayca ingilizce öğrenebileceğiniz bir platformdur.
                            Karmaşık sorularını belli bir sürenin altında cevaplanamanızı sağlayarak size dil pratiği yaptırır ve ingilizcenizi geliştirir.
                            Deneme testine hemen başlayabilirsiniz.
                        </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <footer class="py-3 my-4">
                <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                    {/* <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">Home</a></li> */}
                </ul>
                <p class="text-center text-body-secondary">© 2024 Company, Inc</p>
                </footer>
            </div>
        </div>
    );
}