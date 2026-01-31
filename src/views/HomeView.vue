<template>
	<div class="scroll-container">
		<section class="scroll-section" data-bg="1">
			<div class="scroll-section__content">
				<div class="w-100 my-4">
					<img class="logo" src="../assets/logo.png" alt="HKI2050 logo" />
				</div>
				<div class="angled-corner text-start p-4 mb-4">
					<p>
						The November rain falls heavy. In the city below, the delusional promises of the early 21st century never
						came true. Too easily, those with power took, and those without paid the price.
					</p>

					<p>
						Helsinki is a very different place now. Where the old Pearl of the Baltic had its libraries and its trams
						and its quiet charm, there are now concrete-walled enclaves for the rich and squatted ruins for everyone
						else. The institutions are gone. What replaced them is worse.
					</p>

					<p>
						Yet, hope dies hard. Hope is the senseless fuel in the form of a warm bowl of hernekeitto-ramen in the
						steamy bazaars of Nether Helsinki. Hope is the kid with a rusted pistol trying to rob you in the flooded
						highrises of Ruoholahti. And ultimately, hope is what will claim you in HKI2050.
					</p>
				</div>
				<router-link :to="characterLink">
					<button type="button" class="btn--glitch btn" role="link">
						<span class="btn__content">Create Character</span>
						<span class="btn__effect"></span>
						<span class="btn__label">
							<PlusCircleIcon class="btn__label__icon" />
						</span>
					</button>
				</router-link>
			</div>
		</section>

		<section class="scroll-section" data-bg="2" data-align="right">
			<div class="scroll-section__content">
				<div class="angled-corner text-start p-4">
					<h2>How did we get here and what the fuck is hernekeitto-ramen?</h2>
					<p>
						The world has been going downhill for a while now. Climate change is spiraling out of control, very few
						politicians are working towards anything else than re-election, large corporations have galvanized their
						positions, and equality is on life support. Finland wasn't special — just slower to fall.
					</p>

					<p>
						The polarization of Finnish politics in the 2020s did most of the groundwork. Global tensions fed populist
						movements, policies shifted to short-term pandering, and the long-term effects piled up like unpaid rent.
					</p>

					<p>
						In 2031, the economy crashed. If you're old enough to remember the '90s depression, imagine that — only
						nobody recovers this time. Hundreds of thousands unemployed, addicted, desperate. Social services already
						running on fumes couldn't hold. And predatory politicians? They did what they always do: pointed the
						desperate at each other while corporations bought what was left of the government.
					</p>

					<p>Then the sea came.</p>

					<p>
						North pole's collapse had been accelerating for years, but after the crash, Helsinki couldn't afford to
						fight it. Thirteen meters by 2050. Kalasatama, gone. Ruoholahti, half-drowned. Lauttasaari, now three
						separate islands. Entire neighborhoods swallowed, and whatever services remained got privatized to keep the
						lights on in the parts that still mattered to someone with money.
					</p>

					<p>
						In a few decades, Helsinki had turned into a dangerous place. The rich became paranoid and the rest became
						desperate. You could see residential areas with high walls and armed drones right next to the slums.
					</p>

					<p>
						Hernekeitto-ramen, right. It’s a low-cost, high-protein street delicacy made of – you guessed it –
						hernekeitto and noodles. For a few extra DEM you can even get a boiled egg to go with it. Enjoy with mustard
						or wasabi.
					</p>
				</div>
			</div>
		</section>

		<section class="scroll-section" data-bg="3" data-align="left">
			<div class="scroll-section__content">
				<div class="angled-corner text-start p-4">
					<h2>High-tech toys for the rich</h2>
					<p>
						Giant corporations like Gobble are thriving during these hard times. After all, chaos creates opportunities
						for those who don’t mind a little collateral damage.
					</p>

					<p>
						Human augmentation has taken great leaps forward and it’s not uncommon to see someone sporting implants or
						cybernetic limbs. The people who tested the early versions aren't around to complain about the side effects,
						but the current models work beautifully. If you can afford the steep initial cost and premium maintenance.
					</p>

					<p>
						A lot of research has also gone into weapons and security. In an unstable society, it's easy to sell the
						illusion of safety. A second hand AK-47 runs you about a month's wage. Military-grade mecha, considerably
						more. Both sell well.
					</p>

					<p>Welcome to HKI2050. Watch your back.</p>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { v4 as uuidv4 } from "uuid"
import { PlusCircleIcon } from "@heroicons/vue/24/outline"

const mainContent = ref("")

const characterLink = computed(() => {
	const characterId = uuidv4()
	return `/characters/${characterId}`
})
</script>

<style scoped lang="scss">
.scroll-container {
	position: relative;
}

.scroll-section {
	min-height: 100vh;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4rem 1rem;

	background-attachment: fixed;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;

	&[data-bg="1"] {
		background-image: url("../assets/map.jpg");
	}

	&[data-bg="2"] {
		background-image: url("../assets/bg1.jpg");
	}

	&[data-bg="3"] {
		background-image: url("../assets/bg2.jpg");
	}

	&[data-align="left"] {
		justify-content: flex-start;
	}

	&[data-align="right"] {
		justify-content: flex-end;
	}
}

.scroll-section__content {
	position: relative;
	z-index: 2;
	max-width: 50%;
	width: 100%;
	text-align: center;
	padding: 0 2rem;
}

.logo {
	width: 240px;
	margin-bottom: 1rem;
}

/* Smooth scroll behavior */
html {
	scroll-behavior: smooth;
}

/* Responsive adjustments */
@media (max-width: 992px) {
	.scroll-section__content {
		max-width: 70%;
	}
}

@media (max-width: 768px) {
	.scroll-section {
		padding: 2rem 1rem;
		justify-content: center !important;
	}

	.scroll-section__content {
		max-width: 100%;
		padding: 0 1rem;
	}
}
</style>
