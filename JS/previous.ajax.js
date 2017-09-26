/**
 * AJAX Script to load previous post
 */
"use strict";
(function ( $ ) {

	/**
	 * PostData object and its properties( post_id, theme_uri, rest_uri ) have been passed from wp_localize_script function
	 * from functions.php and these properties contains post_id, theme_uri and rest_uri respectively
	 */
	var postID = postdata.post_id,
		themeURI = postdata.theme_uri,
		restURL = postdata.rest_url;
	
	console.log( 'postID: ' + postID + ' themeURI: ' + themeURI + ' restURL: ' + restURL );
	// javascript:void( 0 ) will ensure the link default action is disabled
	$( '.load-previous a' ).attr( 'href', 'javascript:void( 0 )' );

	/**
	 * We are writing this event listener inside a function because the link element might not be available initially.
	 * So we will call this function when the link ( .load-previous a ) becomes available.
	 */
	function previousPostTrigger() {
		var trigger = $( '.load-previous a' ),

			/**
			 * The trigger.offset().top will tell us how many px is the trigger element away from the top.
			 * And we subtract this value from window's outer height. If we get a positive value then item is below the window's bottom
			 * If we get 0 means the item is exactly at the bottom of the window and minus means its above the window's bottom
			 * We are doing plus 150 px to create a loading effect
			 */
			triggerPosition = trigger.offset().top + 150 - $( window ).outerHeight();

		$( window ).scroll( function ( event ) {

			// If triggerPosition is below the bottom of the window
			if ( triggerPosition > $( window ).scrollTop ) {
			    return;
			}

			// If the previous post link is visible . Call the getPreviousPost()
			getPreviousPost( trigger );

			// Stop the monitoring of the scrolling option once scrolling has stopped
			$( this ).off( event );
		})
	}
	previousPostTrigger();

	/**
	 *
	 */
	function getPreviousPost( trigger ) {

		// Storing id from the data-id attribute of the link for the previous post
		var previousPostID = $( trigger ).attr( 'data-id' ),
			jsonURL = restURL + 'posts/' + previousPostID + '?_embed=true';
		console.log( jsonURL );

		// Show the .ajax-loader image
		$( '.ajax-loader' ).show();
		/**
		 * Retrieves the json data of the jsonURL of the single post with previousPostID (using REST API ) and stores it into object.
		 * It then calls the build_post function by passing this object as its parameter
		 */
		$.ajax({
			dataType: 'json',
			url: jsonURL
		}).done( function ( object ) {
			build_post( object );
		} ).fail( function () {
			console.log( 'error' );
		} ).always( function() {
			console.log( 'AJAX Complete' );
		} );

		/**
		 * Creates a content for the post and replaces it with .post-navigation div when the previous post link is visible at the bottom
		 *
		 * @param object
		 *
		 * return void
		 */
		function build_post( object ) {
			var featuredImageID = object.featured_media,
				date = new Date( object.date ),
				previousPostContent,
				featuredImgSrc = '';

			if ( featuredImageID === 0 ) {
				featuredImgSrc = '';
			} else {
				featuredImgSrc = object._embedded['wp:featuredmedia'][0].media_details.sizes.large.source_url;
			}
		    previousPostContent =
			'<div class="generated">' +
			'<div class="date-author">' + date + ' -By ' + object._embedded.author[0].name + '</div>' +
			'<h1>' + object.title.rendered + '</h1>' +
			'<div class="featured-image"><img src=" ' + featuredImgSrc + '"></div>' +
			'<div class="post-content">' + object.content.rendered + '</div>' +
			'<nav class="navigation post-navigation load-previous" role="navigation">' +
			'<span class="nav-subtitle">Previous Post</span>' +
					'<div class="nav-links">' +
						'<div class="nav-previous">' +
							'<a href="javascript:void( 0 )" data-id="' + object.previous_post_ID + '">' + object.previous_post_title + '</a>' +
						'</div>' +
			        '</div>' +
			        '<div class="ajax-loader"><img src="http://build.wordpress-develop.dev/wp-content/themes/twentyseventeen-infinite-scroll-child/SVG-Loaders/svg-loaders/oval.svg" width="80" height="80" alt=""></div>' +
			'</nav>' +
			'</div>';
			$( '.post-navigation' ).replaceWith( previousPostContent );

			// Reinitialize previousPostTrigger on the new content . Means set the event listener on previous post link of the new content.
			previousPostTrigger();
		}
	}
})( jQuery );