(function(){

var quotes={"quotes":[
{body: "Yesterday, you said tomorrow.", source: "Unknown"},
{body: "Don't compare your beginning to someone else's middle.", source: "Unknown"},
{body: "The wisest mind has something yet to learn.", source: "Unknown"},
{body: "Be the change you wish to see in the world.", source: "Gandhi"},
{body: "When you're going through hell, keep going.", source: "Winston Churchill"},
{body: "Don't let perfection become procrastination. Do it now.", source: "Unknown"},
{body: "Launch and learn. Everything is progress.", source: "Unknown"},
{body: "A year from now you will wish you had started today.", source: "Karen Lamb"},
{body: "Failure is success if you learn from it.", source: "Unknown"},
{body: "If you don't like where you are, change it.", source: "Unknown"},
{body: "If it ain't fun, don't do it.", source: "Unknown"},
{body: "A wet man does not fear the rain.", source: "Unknown"},
{body: "Stay hungry; stay foolish.", source: "Unknown"},
{body: "No one saves us but ourselves. No one can and no one may. We ourselves must walk the path.", source: "Buddha"},
{body: "Never give up. Never let things out of your control dictate who you are.", source: "Unknown"},
{body: "Be kind; everyone you meet is fighting a hard battle.", source: "Unknown"},
{body: "Impossible is just a big word thrown around by small men who find it easier to live in the world they've been given than to explore the power they have to change it.", source: "Unknown"},
{body: "People who are unable to motivate themselves must be content with mediocrity no matter how impressive their other talents.", source: "Andrew Carnegie"},
{body: "Progress is impossible without change, and those who cannot change their minds cannot change anything.", source: "Unknown"},
{body: "Do more of what makes you happy.", source: "Unknown"},
{body: "Do a little more of what you want to do every day, until your idea becomes what's real.", source: "Unknown"},
{body: "You got this. Make it happen.", source: "Unknown"},
{body: "Don't blame others as an excuse for your not working hard enough.", source: "Unknown"},
{body: "Care about what other people think and you will always be their prisoner.", source: "Lao Tzu"},
{body: "To escape criticism: do nothing, say nothing, be nothing.", source: "Unknown"},
{body: "The world is moving so fast that the man who says it can't be done is generally interrupted by someone doing it.", source: "Elbert Hubbard"},
{body: "Be who you are and say what you feel, because those who mind don't matter and those who matter don't mind.", source: "Elbert Hubbard"},
{body: "One day you will wake up and there won't be any more time to do the things you've always wanted. Do it now.", source: "Paulo Coelho"},
{body: "Never waste a minute thinking about people you don't like.", source: "Dwight Eisenhower"},
{body: "Never let your fear decide your fate.", source: "Unknown"},
{body: "Keep moving forward. One step at a time.", source: "Unknown"},
{body: "Life is simple. Are you happy? Yes? Keep going. No? Change something.", source: "Unknown"},
{body: "The journey of a thousand miles begins with a single step.", source: "Unknown"},
{body: "First they ignore you, then they laugh at you, then they fight you, then you win.", "notes": "Commonly attributed to Gandhi, but there is some controversy as to the source: http://en.wikiquote.org/wiki/Mahatma_Gandhi#Quotes_about_Gandhi", source: "Unknown"},
{body: "A man is but the product of his thoughts. What he thinks, he becomes.", source: "Gandhi"},
{body: "Live as if you were to die tomorrow. Learn as if you were to live forever.", source: "Gandhi"},
{body: "The future depends on what we do in the present.", source: "Gandhi"},
{body: "I am strong because I've been weak. I am fearless because I've been afraid. I am wise, because I've been foolish.", source: "Unknown"},
{body: "Believe in yourself.", source: "Unknown"},
{body: "Lower the cost of failure.", source: "Unknown"},
{body: "Keep your goals away from the trolls.", source: "Unknown"},
{body: "Respect yourself enough to walk away from anything that no longer serves you, grows you, or makes you happy.", source: "Robert Tew"},
{body: "Everything around you that you call life was made up by people, and you can change it.", source: "Unknown"},
{body: "In times of change, learners inherit the earth, while the learned find themselves beautifully equipped to deal with a world that no longer exists.", source: "Eric Hoffer"},
{body: "If you fear failure, you will never go anywhere.", source: "Unknown"},
{body: "Go ahead, let them judge you.", source: "Unknown"},
{body: "The world breaks everyone and afterward many are strong at the broken places.", source: "Unknown"},
{body: "The only disability in life is a bad attitude.", source: "Unknown"},
{body: "If most of us are ashamed of shabby clothes and shoddy furniture, let us be more ashamed of shabby ideas and shoddy philosophies.", source: "Einstein"},
{body: "It is no measure of health to be well adjusted to a profoundly sick society.", source: "Krishnamurti"},
{body: "Think lightly of yourself and deeply of the world.", source: "Miyamoto Musashi"},
{body: "Dude, suckin' at something is the first step to being sorta good at something.", source: "Unknown"},
{body: "As you think, so shall you become.", source: "Unknown"},
{body: "Do not wish for an easy life. Wish for the strength to endure a difficult one.", source: "Bruce Lee"},
{body: "Showing off is the fool's idea of glory.", source: "Bruce Lee"},
{body: "Use only that which works, and take it from any place you can find it.", source: "Bruce Lee"},
{body: "I'm not in this world to live up to your expectations and you're not in this world to live up to mine.", source: "Bruce Lee"},
{body: "If you spend too much time thinking about a thing, you'll never get it done.", source: "Bruce Lee"},
{body: "Knowing is not enough, we must apply. Willing is not enough, we must do.", source: "Bruce Lee"},
{body: "Empty your cup so that it may be filled; become devoid to gain totality.", source: "Bruce Lee"},
{body: "It's not the daily increase but daily decrease. Hack away at the unessential.", source: "Bruce Lee"},
{body: "Be yourself. Everyone else is already taken.", source: "Oscar Wilde"},
{body: "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.", source: "MLK Jr."},
{body: "Yesterday is history; tomorrow is a mystery. Today is a gift, which is why we call it the present.", source: "Bil Keane"},
{body: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", source: "Einstein"},
{body: "I have not failed. I've just found 10,000 ways that won't work.", source: "Thomas Edison"},
{body: "When I let go of what I am, I become what I might be.", source: "Unknown"},
{body: "It is never too late to be what you might have been.", source: "George Eliot"},
{body: "Always be yourself, express yourself, have faith in yourself. Do not go out and look for a successful personality and duplicate it.", source: "Bruce Lee"},
{body: "When you are content to be simply yourself and don't compare or compete, everyone will respect you.", source: "Lao Tzu"},
{body: "If you want to awaken all of humanity, awaken all of yourself.", source: "Lao Tzu"},
{body: "Don't regret anything you do, because in the end it makes you who you are.", source: "Unknown"},
{body: "Tension is who you think you should be. Relaxation is who you are.", source: "Unknown"},
{body: "You are confined only by the walls you build yourself.", source: "Unknown"},
{body: "Unless you try to do something beyond what you have already mastered you will never grow.", source: "Ralph Waldo Emerson"},
{body: "Don't think about what might go wrong, think about what could be right.", source: "Unknown"},
{body: "What the caterpillar calls the end, the rest of the world calls a butterfly.", source: "Lao Tzu"},
{body: "To be beautiful means to be yourself. You don't need to be accepted by others. You need to be yourself.", source: "Thich Nhat Hanh"},
{body: "Let go of those who bring you down and surround yourself with those who bring out the best in you.", source: "Unknown"},
{body: "Don't let small minds convince you that your dreams are too big.", source: "Unknown"},
{body: "If you don't like something, change it. If you can't change it, change your attitude. Don't complain.", source: "Mary Angelou"},
{body: "You can't climb the ladder of success with your hands in your pockets.", source: "Arnold Schwarzenegger"},
{body: "You can feel sore tomorrow or you can feel sorry tomorrow. You choose.", source: "Unknown"},
{body: "It is more important to know where you are going than to get there quickly. Do not mistake activity for achievement.", source: "Isocrates"},
{body: "There are seven days in the week and someday isn't one of them.", source: "Unknown"},
{body: "Start where you are. Use what you can. Do what you can.", source: "Arthur Ashe"},
{body: "Dreams don't work unless you do.", source: "Unknown"},
{body: "When you wake up in the morning you have two choices: go back to sleep, or wake up and chase those dreams.", source: "Unknown"},
{body: "Everybody comes to a point in their life when they want to quit, but it's what you do at that moment that determines who you are.", source: "Unknown"},
{body: "This is your life. Do what you love, and do it often.", source: "Unknown"},
{body: "Live your dream, and wear your passion.", source: "Unknown"},
{body: "Today I will do what others won't, so tomorrow I can do what others can't.", source: "Unknown"},
{body: "The biggest room in the world is room for improvement.", source: "Unknown"},
{body: "If people aren't laughing at your dreams, your dreams aren't big enough.", source: "Unknown"},
{body: "Never look back unless you are planning to go that way.", source: "Unknown"},
{body: "Every dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world.", source: "Unknown"},
{body: "You are awesome.", source: "Unknown"},
{body: "Simplicity is the ultimate sophistication.", source: "Unknown"},
{body: "Anyone who stops learning is old.", source: "Henry Ford"},
{body: "The cure to boredom is curiosity.", source: "Unknown"},
{body: "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway.", source: "Unknown"},
{body: "It's time to start living the life you've only imagined.", source: "Unknown"},
{body: "You don't have to live your life the way other people expect you to.", source: "Unknown"},
{body: "The trouble with not having a goal is that you can spend your life running up and down the field and never score.", source: "Unknown"},
{body: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", source: "Unknown"},
{body: "Incredible change happens in your life when you decide to take control of what you do have power over instead of craving control over what you don't.", source: "Unknown"},
{body: "Do more with less.", source: "Unknown"},
{body: "Overthinking ruins you. Ruins the situation, twists it around, makes you worry and just makes everything much worse than it actually is.", source: "Unknown"},
{body: "Replace fear of the unknown with curiosity.", source: "Unknown"},
{body: "The surest way to find your dream job is to create it.", source: "Unknown"},
{body: "What you do today is important because you are exchanging a day of your life for it.", source: "Unknown"},
{body: "One man or woman with courage is a majority.", source: "Unknown"},
{body: "Do one thing every day that scares you.", source: "Eleanor Roosevelt"},
{body: "Failure is simply the opportunity to begin again, this time more intelligently.", source: "Henry Ford"},
{body: "Don't just wait for inspiration. Become it.", source: "Unknown"},
{body: "Don't limit your challenges", source: "challenge your limits."},
{body: "When you judge others, you do not define them; you define yourself.", source: "Wayne Dyer"},
{body: "Time you enjoy wasting is not wasted time.", source: "Unknown"},
{body: "Do small things with great love.", source: "Mother Teresa"},
{body: "Go forth and make awesomeness.", source: "Unknown"},
{body: "Your big opportunity may be right where you are now.", source: "Napoleon Hill"},
{body: "Life begins at the end of your comfort zone.", source: "Unknown"},
{body: "Excuses are born out of fear. Eliminate your fear and there will be no excuses.", source: "Unknown"},
{body: "Happiness is not the absence of problems, it's the ability to deal with them.", source: "Unknown"},
{body: "The problem is not the problem. The problem is your attitude about the problem.", source: "Unknown"},
{body: "You don't have to be great to start, but you have to start to be great.", source: "Unknown"},
{body: "Cherish your visions and your dreams as they are the children of your soul, the blueprints of your ultimate achievements.", source: "Unknown"},
{body: "Decide that you want it more than you are afraid of it.", source: "Unknown"},
{body: "Adventure may hurt you, but monotony will kill you.", source: "Unknown"},
{body: "Obsessed is a word that the lazy use to describe the dedicated.", source: "Unknown"},
{body: "If they can do it, so can you.", source: "Unknown"},
{body: "Success isn't about being the best. It's about always getting better.", source: "Behance 99U"},
{body: "Success is the ability to go from failure to failure without losing your enthusiasm.", source: "Winston Churchill"},
{body: "A pessimist sees the difficulty in every opportunity; an optimist sees the opportunity in every difficulty.", source: "Winston Churchill"},
{body: "Failure is just practice for success.", source: "Unknown"},
{body: "Shipping beats perfection.", source: "Unknown"},
{body: "Failure is simply the opportunity to begin again. This time more intelligently.", source: "Henry Ford"},
{body: "While we are postponing, life speeds by.", source: "Seneca"},
{body: "It always seems impossible until it's done.", source: "Nelson Mandela"},
{body: "Don't let the mistakes and disappointments of the past control and direct your future.", source: "Zig Ziglar"},
{body: "It's not about where your starting point is, but your end goal and the journey that will get you there.", source: "Unknown"},
{body: "Waste no more time arguing about what a good person should be. Be one.", source: "Marcus Aurelius"},
{body: "Life shrinks of expands in proportion to one's courage.", source: "Anais Nin"},
{body: "Absorb what is useful. Discard what is not. Add what is uniquely your own.", source: "Bruce Lee"},
{body: "Don't find fault. Find a remedy.", source: "Henry Ford"},
{body: "Doubt kills more dreams than failure ever will.", source: "Karim Seddiki"},
{body: "Don't let someone who gave up on their dreams talk you out of going after yours.", source: "Zig Ziglar"}
]}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var q = document.getElementById('quote');
var rand=getRandomInt(0,quotes.quotes.length);
q.innerHTML=`${quotes.quotes[rand].body} <br>- ${quotes.quotes[rand].source}`

})();
