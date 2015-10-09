<!DOCTYPE html>

<html><head lang="en">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no" />

    <title>Code of War 2015</title>
    <meta name="description" content="Code of War 2015">

    <link rel="stylesheet" href="styles/css/reset.css">
    <link rel="stylesheet" href="styles/css/style.css">

    <!--[if lt IE 9]>
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>
<body>
    <div id="frontend_app">
        <section class="mainContainer">
            <div id="players">
                <div id="logoCow">
                    <img src="images/logo_CoW.svg" alt="Code of War">
                </div>
                <div id="ia1InfoContainer" class="player">
                    <div class="content">
                        <div class="team">
                            <div class="avatar">
                                <img data-id="_logo" src="http://3.bp.blogspot.com/_XMH6qEyqIPU/S9YSkGiuZyI/AAAAAAAAB4g/8PoYjbZcNfY/s400/sakura2.jpg" alt="">
                            </div>
                            <p class="name" data-id="_name">DemoIA</p>
                        </div>
                        <img src="images/arrow.svg" alt="V" class="arrowSeparator">
                        <div class="character">
                            <img data-id="_profil" src="images/profil-1-2.svg" alt=""></img>
                        </div>
                        <div class="score">
                            <p class="total">15689</p>
                            <p class="pointSup">+ 433</p>
                        </div>
                        <ul class="bonus">
                            <li><img src="images/bonus-1.svg" alt=""><p data-id="_potion">0</p></li>
                            <li><img src="images/bonus-2.svg" alt=""><p data-id="_trap">0</p></li>
                            <li><img src="images/bonus-3.svg" alt=""><p data-id="_parfum">0</p></li>
                            <li><img src="images/bonus-4.svg" alt=""><p data-id="_pm">1</p></li>
                        </ul>
                    </div>
                </div>
                <div id="ia2InfoContainer" class="player">
                    <div class="content">
                        <div class="team">
                            <div class="avatar">
                                <img data-id="_logo" src="http://3.bp.blogspot.com/_XMH6qEyqIPU/S9YSkGiuZyI/AAAAAAAAB4g/8PoYjbZcNfY/s400/sakura2.jpg" alt="">
                            </div>
                            <p class="name" data-id="_name">DemoIA</p>
                        </div>
                        <img src="images/arrow.svg" alt="V" class="arrowSeparator">
                        <div class="character">
                            <img data-id="_profil" src="images/profil-1-1.svg" alt=""></img>
                        </div>
                        <div class="score">
                            <p class="total">15689</p>
                            <p class="pointSup">+ 433</p>
                        </div>
                        <ul class="bonus">
                            <li><img src="images/bonus-1.svg" alt=""><p data-id="_potion">0</p></li>
                            <li><img src="images/bonus-2.svg" alt=""><p data-id="_trap">0</p></li>
                            <li><img src="images/bonus-3.svg" alt=""><p data-id="_parfum">0</p></li>
                            <li><img src="images/bonus-4.svg" alt=""><p data-id="_pm">1</p></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="gameContainer">
                <div id="endScreenContainer">
                    <div class="end-screen">
                        <div class="screen play">
                            <img src="images/victory.svg" alt="Bravo !" class="victory">
                            <div data-id="_title" class="end-title">VICTOIRE !</div>
                        </div>
                        <div class="screen play">
                            <div class="avatar">
                                <img data-id="_logo" src="http://3.bp.blogspot.com/_XMH6qEyqIPU/S9YSkGiuZyI/AAAAAAAAB4g/8PoYjbZcNfY/s400/sakura2.jpg" alt="">
                            </div>
                            <p class="name" data-id="_name">DemoIA 1443440832300</p>
                            <div data-id="_message" class="end-message">a attrapé la cible</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <script src="js/easeljs-0.7.1.min.js"></script>
    <script src="js/Frontend.js"></script>
    <script src="js/script.js"></script>
    <script>
       Frontend.init('http://localhost:3000','Play');
    </script>
</body>
</html>