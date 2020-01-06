Meteor.startup(function() {
 // 	var Twit = Meteor.npmRequire('twit');



	// var T = new Twit({
	//     consumer_key:         Meteor.settings.public.TWITTER_CUSTOMER_KEY, // API key
	//     consumer_secret:      Meteor.settings.public.TWITTER_CUSTOMER_SECRET,
	// 	access_token:         Meteor.settings.public.TWITTER_ACCESS_TOKEN, 
 //        access_token_secret:  Meteor.settings.public.TWITTER_ACCESS_SECRET
	// });

	// Accounts.loginServiceConfiguration.remove({
 //       service : 'twitter'
 //    });
 
	// Accounts.loginServiceConfiguration.insert({
	//     service     : 'twitter',
	//     consumerKey : Meteor.settings.public.TWITTER_CUSTOMER_KEY,
	// 	secret      : Meteor.settings.public.TWITTER_CUSTOMER_SECRET
	// });
 


	// // T.get('friends/list',
	// //     {
	// //         cursor: -1,
	// //         screen_name: 'aqib1604',
	// //         skip_status: true,
	// //         include_user_entities: false
	// //     },
	// //     function(err, data, response) {
	// //         console.log(data);
	// //     }
	// // );

	// // T.post('direct_messages/new',
	// //     {
	// //         screen_name: 'aqib1604',
	// //         text: 'It\'s Just a test buddy.. :)'
	// //     },
	// //     function(err, data, response) {
	// //         console.log(data);
	// //     }
	// // );

	// var Tget = Meteor.wrapAsync(T.get, T);

	// Meteor.methods({
	// 	getFriendlist (userName){
	// 	    return Tget('followers/list',
	// 		    {
	// 		        cursor: -1,
	// 		        screen_name: userName,
	// 		        skip_status: true,
	// 		        include_user_entities: false,
	// 		        count: 200
	// 		    });
	//   	},
	// })

});


