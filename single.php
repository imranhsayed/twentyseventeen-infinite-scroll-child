<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package WordPress
 * @subpackage Twenty_Seventeen
 * @since 1.0
 * @version 1.0
 */

get_header(); ?>

<?php
/* Start the Loop */
while ( have_posts() ) : the_post();
?>
	<div class="wrap">
	<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">
<!-- Returns the post title and content -->
		<?php get_template_part( 'template-parts/post/content', get_post_format() ); ?>
	</main><!-- #main -->
	</div><!-- #primary -->
	<nav class="navigation post-navigation load-previous" role="navigation">
		<span class="nav-subtitle">Previous Post</span>
		<div class="nav-links">
			<div class="nav-previous">
				<?php $previous_post = get_previous_post(); ?>
				<a href="<?php echo get_permalink( $previous_post->ID ); ?>" data-id="<?php echo $previous_post->ID; ?>">
					<?php echo $previous_post->post_title; ?>
				</a>
				<div class="ajax-loader"><img src="<?php echo get_theme_file_uri( 'SVG-Loaders/svg-loaders/oval.svg' ); ?>" width="80" height="80" alt=""></div>
			</div>
		</div>
	</nav>
<?php endwhile; // End of the loop.	?>

	<?php get_sidebar(); ?>

<?php get_footer();