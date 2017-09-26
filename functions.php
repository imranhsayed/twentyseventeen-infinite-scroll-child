<?php
/**
 * Add fields to the REST API response
 */

add_action( 'rest_api_init', 'tschild_register_fields' );
function tschild_register_fields() {
	register_rest_field( 'post',
		'previous_post_ID',
		array(
			'get_callback'    => 'tschild_get_previous_post_ID',
			'update_callback' => null,
			'schema'          => null,
		)
	);
	register_rest_field( 'post',
		'previous_post_title',
		array(
			'get_callback'    => 'tschild_get_previous_post_title',
			'update_callback' => null,
			'schema'          => null,
		)
	);
	register_rest_field( 'post',
		'previous_post_link',
		array(
			'get_callback'    => 'tschild_get_previous_post_link',
			'update_callback' => null,
			'schema'          => null,
		)
	);
}

function tschild_get_previous_post_ID() {
	return get_previous_post()->ID;
}

function tschild_get_previous_post_title() {
	return get_previous_post()->post_title;
}

function tschild_get_previous_post_link() {
	return get_permalink( get_previous_post()->link );
}

/**
 * Enqueue JavaScript
 */
add_action( 'wp_enqueue_scripts', 'tsc_scripts' );
function tsc_scripts() {

	// The is_single() checks if you are on single.php page.
	if ( is_single() ) {

		// The wp_enqueue_script() includes the previous.ajax.js file, sets its dependency to jquery and footer required to true
	    wp_enqueue_script( 'tsc-js', get_theme_file_uri( 'JS/previous.ajax.js' ), array( 'jquery' ), '0.1', true );

	    /**
	     * This is actually a wordpress function to pass translation string to JavaScript file.
	     * However, here we will pass information from WordPress into JavaScript file.
	     * This function associates itself to an existing script that we are loading using a label
	     * In this case, it will associate itself to wp_enqueue_script with label 'tsc-js'
	     * We are using name of the object as postdata which will have all post information and this postdata object will be
	     * passed to previous.ajax.js file with the data contained in the third parameter array.
	     * get_the_ID() gets the post id which will be stored in post_id property of postdata object and passed to js file
	     * And similarly the get_stylesheet_directory_uri and rest_url
	     */
	    wp_localize_script( 'tsc-js', 'postdata',
	      array(
	      	'post_id' => get_the_ID(),
	      	'theme_uri' => get_stylesheet_directory_uri(),
		    'rest_url' => rest_url( 'wp/v2/' ),
	      )
	    );
	}
}