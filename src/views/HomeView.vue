<template>
	<div class="scroll-container">
		<!-- Section 1: Original Welcome Section -->
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
						Helsinki is a very different place now. The institutions, infrastructure, and charm of the Pearl of the
						Baltic Sea are a thing of the past, replaced by a despairing melancholy, vile corporations, corrupt
						officials, and ruthless factions.
					</p>
					<p>
						Yet, hope dies hard. Hope is the senseless fuel in the form of a warm bowl of hernekeitto-ramen in the
						steamy bazaars of Nether Helsinki. Hope is why they're trying to rob you in the flooded highrises of
						Ruoholahti. And ultimately, hope is what will claim you in HKI2050.
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

		<!-- Section 2: The Districts -->
		<section class="scroll-section" data-bg="2" data-align="right">
			<div class="scroll-section__content">
				<div class="angled-corner text-start p-4">
					<h2>The Districts of HKI2050</h2>
					<p>
						The old city maps are useless now. Helsinki has been carved up, remade, and reborn as something darker. Each
						district has its own character, its own dangers, its own opportunities for those willing to take the risk.
					</p>

					<h3>Ruoholahti Spires</h3>
					<p>
						What were once luxury apartment towers now stand half-submerged in toxic water. The lower floors are
						flooded, home to amphibious gangs and desperate squatters. But climb higher, and you'll find makeshift
						communities clinging to existence, connected by rickety bridges and zip lines. The view from the top is
						spectacular—if you can afford the climb and survive the territorial disputes.
					</p>
					<p>
						The Ruoholahti markets operate on the mid-levels, where traders hawk salvaged pre-collapse tech, dubious
						food rations, and black market cybernetics. Security is non-existent. Justice is personal. Transactions
						happen fast, and so do betrayals.
					</p>

					<h3>Nether Helsinki</h3>
					<p>
						Beneath the streets lies another city entirely. The old metro tunnels, parking garages, and service
						corridors have been expanded into a sprawling underground network. Down here, the corporations have less
						reach, but that doesn't mean it's safe.
					</p>
					<p>
						Nether Helsinki is controlled by the Cartels—loose confederations of smugglers, hackers, and fixers who keep
						the illegal economy running. The air is thick with steam from illegal kitchen operations, the smell of ozone
						from hacked power taps, and the constant hum of jury-rigged ventilation systems.
					</p>
					<p>
						The deeper you go, the stranger it gets. There are whole sections that have been sealed off, accessible only
						to those with the right access codes or enough explosives. Rumor has it that some of the old government
						bunkers are still down there, sealed with tech that predates the collapse.
					</p>

					<h3>The Corporate Zone</h3>
					<p>
						In stark contrast to the chaos elsewhere, the Corporate Zone is a gleaming fortress of order and oppression.
						Here, the megacorps maintain their headquarters behind walls of steel and surveillance. Private security
						forces patrol in power armor, and drones monitor every corner.
					</p>
					<p>
						Only those with proper credentials can enter—employees, contractors, or the occasional desperate courier
						willing to risk the checkpoints for a high-paying delivery. Inside, life is comfortable, clean, and utterly
						soulless. The corps own everything: your job, your home, your future. They call it "stability." Everyone
						else calls it slavery.
					</p>
					<p>
						But even the corps aren't monolithic. Corporate espionage is rampant, with rival companies constantly trying
						to steal each other's secrets. Smart operators can make a fortune playing the corps against each other—if
						they don't get caught in the crossfire.
					</p>

					<h3>The Fringe</h3>
					<p>
						Beyond the city proper lies the Fringe—a lawless sprawl of abandoned factories, toxic waste dumps, and
						shanty towns. This is where Helsinki ends and the wasteland begins. The people out here are the forgotten
						ones: refugees from other collapsed cities, exiles from the corps, and those who simply couldn't make it
						anywhere else.
					</p>
					<p>
						But the Fringe has its own ecosystem. Scavenger crews pick through the ruins of the old world, finding
						treasures and terrors in equal measure. Independent communities have formed, each with its own rules and
						leadership. And somewhere out there, in the toxic fog, are the Nomad clans—groups who've rejected the city
						entirely and survive on their own terms.
					</p>
				</div>
			</div>
		</section>

		<!-- Section 3: The Factions -->
		<section class="scroll-section" data-bg="3" data-align="left">
			<div class="scroll-section__content">
				<div class="angled-corner text-start p-4">
					<h2>The Factions</h2>
					<p>
						In HKI2050, allegiances matter. The city is a web of competing interests, and everyone has to choose where
						they stand—or at least, where they pretend to stand.
					</p>

					<h3>The Megacorps</h3>
					<p>
						NordicSec, TechnoVaara, and the BioFinn Consortium are the big three. They control the economy, the
						infrastructure, and most of the firepower. If you work for them, you have security and access to the best
						tech. But you also have zero freedom and even less privacy.
					</p>
					<p>
						Corporate employees are tracked 24/7. Neural implants monitor productivity. Dissent is identified and
						"corrected" before it can spread. The corps don't just employ you—they own you. And if you're not useful
						anymore, you're discarded.
					</p>
					<p>
						Still, some people thrive in the corporate world. Those with ambition and no conscience can climb the
						ladder, stepping on anyone in their way. And the perks at the top are undeniable: penthouses in the
						Corporate Zone, access to bleeding-edge biotech, and the kind of power that can reshape the city.
					</p>

					<h3>The Cartels</h3>
					<p>
						If the corps are order, the Cartels are chaos—but profitable chaos. Operating out of Nether Helsinki, the
						Cartels control the black market, the smuggling routes, and the underground networks that keep the city
						running when the official systems fail.
					</p>
					<p>
						The Cartels aren't unified. They're a loose alliance of criminal enterprises, each with their own specialty:
						data theft, weapon smuggling, human trafficking, or pharmaceutical production. Rivalry between Cartel
						factions is common, and turf wars can turn entire districts into war zones overnight.
					</p>
					<p>
						But if you need something the corps won't sell you, the Cartels have it. If you need to disappear, they can
						make it happen. And if you're skilled enough, they'll pay top credit for your services—no questions asked.
					</p>

					<h3>The Ghosts</h3>
					<p>
						No one knows who founded the Ghosts or what they really want. They operate in the shadows, a network of
						hackers, spies, and saboteurs who strike at both corporate and Cartel targets with equal impunity.
					</p>
					<p>
						Some say the Ghosts are freedom fighters, trying to bring down the corrupt systems that control the city.
						Others say they're terrorists, sowing chaos for its own sake. The truth is probably somewhere in between—or
						something stranger entirely.
					</p>
					<p>
						What is known is that the Ghosts have access to tech that shouldn't exist. They can hack supposedly
						unhackable systems, infiltrate the most secure facilities, and vanish without a trace. Joining the Ghosts is
						nearly impossible—they recruit you, not the other way around. And once you're in, there's no getting out.
					</p>

					<h3>The Independents</h3>
					<p>
						Not everyone picks a side. The Independents are the mercenaries, the fixers, the solo operators who survive
						by their wits and their skills. They take jobs from whoever pays the best, switching allegiances as easily
						as changing clothes.
					</p>
					<p>
						Being Independent means freedom, but it also means risk. You have no backup, no organization to fall back on
						when things go wrong. You live or die by your own choices. But for those who can handle it, there's no
						better life. You answer to no one, owe nothing to anyone, and carve your own path through the neon-lit chaos
						of HKI2050.
					</p>
					<p>
						Some Independents work as couriers, running packages through hostile territory. Others are
						enforcers-for-hire, solving problems with violence. And then there are the legends—the solos so skilled, so
						dangerous, that even the megacorps think twice before crossing them.
					</p>
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
